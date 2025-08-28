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
          // Basic HTML escaping
          function esc(s) {
            return (s == null ? "" : String(s))
              .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
              .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
          }

          var map = L.map('map').setView([27.7089, 85.3206], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

          var currentLocationMarker = null;
          var otherMarkers = [];
          var otherBounds = L.latLngBounds();

          var currentLocationIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" fill="#007AFF" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>'),
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
          });

          var otherLocationIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          });

          // Show current location
          window.setCurrentLocationFromNative = function(lat, lng, accuracy) {
            try {
              if (currentLocationMarker) map.removeLayer(currentLocationMarker);
              map.setView([lat, lng], 15);
              currentLocationMarker = L.marker([lat, lng], { icon: currentLocationIcon })
                .addTo(map)
                .bindPopup("Your current location (±" + Math.round(accuracy) + "m)").openPopup();
            } catch (e) { console.log("setCurrentLocationFromNative error", e); }
          };

          // Add all markers with details
          window.setAllMarkersFromNative = function(items) {
            try {
              // clear
              otherMarkers.forEach(m => map.removeLayer(m));
              otherMarkers = [];
              otherBounds = L.latLngBounds();

              if (!Array.isArray(items)) return;

              items.forEach(function(m) {
                var lat = parseFloat(m?.coordinates?.latitude);
                var lng = parseFloat(m?.coordinates?.longitude);
                if (!isFinite(lat) || !isFinite(lng)) return;

                var marker = L.marker([lat, lng], { icon: otherLocationIcon }).addTo(map);
                marker.on("click", function() { showDetails(m); });
                otherMarkers.push(marker);
                otherBounds.extend([lat, lng]);
              });

              // Fit bounds if we have at least one
              if (otherMarkers.length > 0) {
                map.fitBounds(otherBounds.pad(0.2));
              }
            } catch (e) { console.log("setAllMarkersFromNative error", e); }
          };

          // Sidebar renderer (NO nested template literal here)
         function showDetails(data) {
            var sidebar = document.getElementById("sidebar");
            var title = esc(data?.issueType) || "Unknown";
            var sev = esc(data?.severityLevel) || "N/A";
            var desc = esc(data?.description) || "No description";
            var addr = esc(data?.location) || "No address available";
            var img = (data && data.image) ? String(data.image) : "";

            // always prepend backend API
            var fullUrl = "http://${URL}:4000/api/" + img.replace(/^\\/+/,"");


            var html =
                '<h3>' + title + ' (' + sev + ')</h3>' +
                '<div class="pill">' + title + '</div>' +
                '<div class="pill">Severity: ' + sev + '</div>' +
                '<p><b>Description:</b> ' + desc + '</p>' +
                '<p><b>Location:</b> ' + addr + '</p>';

            if (img) {
                html +=
                '<img src="' +
                fullUrl.replace(/"/g, "&quot;") +
                '" alt="Issue Image" style="max-width:100%;border-radius:8px;margin-top:10px;" />';
            }

            sidebar.innerHTML = html;
            }


          console.log('Map initialized');
        </script>
      </body>
    </html>
  `

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
