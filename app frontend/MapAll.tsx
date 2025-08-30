"use client"

import { useState, useRef, useEffect } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native"
import { WebView } from "react-native-webview"
import * as Location from "expo-location"
import URL from "./config"

const API_URL = `http://${URL}:4000/api/requests/`

const MapModal = ({ visible, onClose }) => {
  const webViewRef = useRef(null)

  useEffect(() => {
    if (visible) {
      requestLocationAndShow()
      fetchAndShowOtherLocations()
    }
  }, [visible])

  // Get current user location and send to WebView
  const requestLocationAndShow = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Location Permission Required", "Enable location permissions to view your location.")
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const { latitude, longitude, accuracy } = location.coords
      const jsCode = `
        if (typeof setCurrentLocationFromNative === 'function') {
          setCurrentLocationFromNative(${latitude}, ${longitude}, ${accuracy});
        }
        true;
      `
      webViewRef.current?.injectJavaScript(jsCode)
    } catch (error) {
      console.error("Error getting current location:", error)
      Alert.alert("Location Error", "Failed to get your location.")
    }
  }

  // Fetch other locations and send full objects to WebView
  const fetchAndShowOtherLocations = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      // Expecting `data` to be an array of request objects
      const jsCode = `
        if (typeof setAllMarkersFromNative === 'function') {
          setAllMarkersFromNative(${JSON.stringify(data)});
        }
        true;
      `
      webViewRef.current?.injectJavaScript(jsCode)
    } catch (error) {
      console.error("Error fetching other locations:", error)
      Alert.alert("Network Error", "Could not load reported locations.")
    }
  }
  

  const mapHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Location Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      body { margin: 0; padding: 0; display: flex; }
      #map { height: 100vh; width: 70vw; }
      #sidebar {
        height: 100vh;
        width: 30vw;
        padding: 15px;
        box-sizing: border-box;
        border-left: 1px solid #ddd;
        background: #fff;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      }
      #sidebar h3 { margin: 0 0 10px; font-size: 18px; }
      #sidebar p { margin: 6px 0; line-height: 1.35; }
      #sidebar img {
        width: 100%;
        max-height: 220px;
        object-fit: cover;
        margin-top: 10px;
        border-radius: 8px;
      }
      .pill { display:inline-block; padding:4px 8px; border-radius:999px; border:1px solid #eee; font-size:12px; margin: 0 4px 8px 0; }
      .leaflet-control-attribution { display: none; }
      @media (max-width: 900px) {
        #map { width: 60vw; }
        #sidebar { width: 40vw; }
      }
      @media (max-width: 700px) {
        body { flex-direction: column; }
        #map { width: 100vw; height: 60vh; }
        #sidebar { width: 100vw; height: 40vh; }
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="sidebar">
      <h3>Location Details</h3>
      <p>Select a marker to see details.</p>
    </div>

    <script>
      function esc(s) {
        return (s == null ? "" : String(s))
          .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
      }

      var map = L.map('map').setView([27.7089, 85.3206], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

      var currentLocationMarker = null;
      var hazards = [];   // store hazards from native
      var renderedMarkers = [];

      var currentLocationIcon = L.divIcon({
        html: '<div style="width:20px;height:20px;background:#007AFF;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3);"></div>',
        className: "",  
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });


      // ----------- CLUSTERING UTILS ----------
      const haversineDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a = Math.sin(dLat/2)**2 +
          Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
          Math.sin(dLng/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R*c;
      };

      const clusterHazards = (hazards, zoom) => {
        const threshold =
          zoom >= 16 ? 0 :
          zoom >= 14 ? 0.3 :
          zoom >= 12 ? 0.7 :
          zoom >= 10 ? 5 :
          zoom >= 8 ? 10 : 20;

        const clusters = [];
        const visited = new Set();

        for (let i=0;i<hazards.length;i++) {
          if (visited.has(i)) continue;
          const cluster = [hazards[i]];
          visited.add(i);
          for (let j=i+1;j<hazards.length;j++) {
            if (visited.has(j)) continue;
            const dist = haversineDistance(
              hazards[i].lat, hazards[i].lng,
              hazards[j].lat, hazards[j].lng
            );
            if (dist < threshold) {
              cluster.push(hazards[j]);
              visited.add(j);
            }
          }
          clusters.push(cluster);
        }
        return clusters;
      };

      function clearMarkers() {
        renderedMarkers.forEach(m => map.removeLayer(m));
        renderedMarkers = [];
      }

      function renderClusters() {
        clearMarkers();
        const zoom = map.getZoom();
        const clusters = clusterHazards(hazards, zoom);

        clusters.forEach(cluster => {
          if (cluster.length === 1) {
            const hazard = cluster[0];
            const marker = L.marker([hazard.lat, hazard.lng]).addTo(map);
            marker.on("click", () => showDetails(hazard));
            renderedMarkers.push(marker);
          } else {
            const latAvg = cluster.reduce((sum,h)=>sum+h.lat,0)/cluster.length;
            const lngAvg = cluster.reduce((sum,h)=>sum+h.lng,0)/cluster.length;
            const clusterIcon = L.divIcon({
              html: '<div style="background:#4B5563;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;">'+cluster.length+'</div>',
              className: "cluster-marker",
              iconSize: [30,30],
              iconAnchor: [15,15]
            });
            const marker = L.marker([latAvg,lngAvg],{icon:clusterIcon}).addTo(map);
            renderedMarkers.push(marker);
          }
        });
      }

      // ------------- Hooks for Native ---------------
      window.setCurrentLocationFromNative = function(lat,lng,accuracy) {
        if (currentLocationMarker) map.removeLayer(currentLocationMarker);
        map.setView([lat,lng],15);
        currentLocationMarker = L.marker([lat,lng],{icon:currentLocationIcon})
          .addTo(map)
          .bindPopup("Your current location (±"+Math.round(accuracy)+"m)").openPopup();
      };

      window.setAllMarkersFromNative = function(items) {
        hazards = [];
        items.forEach(m => {
          const lat = parseFloat(m?.coordinates?.latitude);
          const lng = parseFloat(m?.coordinates?.longitude);
          if (!isFinite(lat)||!isFinite(lng)) return;
          hazards.push({
            lat: lat,
            lng: lng,
            issueType: m.issueType,
            severityLevel: m.severityLevel,
            description: m.description,
            location: m.location,
            image: m.image
          });
        });
        renderClusters();
      };

      map.on("zoomend", renderClusters);

      function showDetails(data) {
        var sidebar = document.getElementById("sidebar");
        var title = esc(data?.issueType)||"Unknown";
        var sev = esc(data?.severityLevel)||"N/A";
        var desc = esc(data?.description)||"No description";
        var addr = esc(data?.location)||"No address available";
        var img = data?.image ? String(data.image) : "";
        var fullUrl = "http://${URL}:4000/api/" + img.replace(/^\\/+/,"");

        var html =
          '<h3>'+title+' ('+sev+')</h3>'+
          '<div class="pill">'+title+'</div>'+
          '<div class="pill">Severity: '+sev+'</div>'+
          '<p><b>Description:</b> '+desc+'</p>'+
          '<p><b>Location:</b> '+addr+'</p>';

        if (img) {
          html += '<img src="'+fullUrl.replace(/"/g,"&quot;")+'" />';
        }
        sidebar.innerHTML = html;
      }

      console.log("Map initialized with clustering");
    </script>
  </body>
</html>
`;


  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Current Location</Text>
          <View style={styles.placeholder} />
        </View>
        <WebView
          ref={webViewRef}
          source={{ html: mapHTML }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled
          originWhitelist={['*']}      // helps with non-https content
          onLoadEnd={() => {
            requestLocationAndShow()
            fetchAndShowOtherLocations()
          }}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: { fontSize: 16, color: "#007AFF" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  placeholder: { width: 50 },
  webView: { flex: 1 },
})

export default MapModal
