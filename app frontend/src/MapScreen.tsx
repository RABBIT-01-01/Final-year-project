import React, { useEffect, useState } from "react"
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { WebView } from "react-native-webview"
import * as Location from "expo-location"
import URL from "../config"

export default function MapScreen({ route }) {
  const { maintenanceTeam } = route.params || {}
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Get Current Location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission was denied")
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
    })()
  }, [])

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://${URL}:4000/api/requests/team/${maintenanceTeam}`)
        const data = await response.json()
        // Normalize data into same structure used by leaflet
        const formatted = data.map((item: any) => ({
          id: item._id,
          type: item.issueType,
          description: item.description,
          latitude: parseFloat(item.coordinates.latitude),
          longitude: parseFloat(item.coordinates.longitude),
          priority: item.severityLevel,
          status: item.status,
          image: item.image ? `http://${URL}:4000${item.image}` : null,
        }))
        setReports(formatted)
      } catch (error) {
        console.error("Error fetching reports:", error)
        Alert.alert("Error", "Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [maintenanceTeam])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Leaflet Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map { height: 100vh; width: 100vw; }
        .popup-title { font-weight: bold; }
        .legend {
          background: white;
          padding: 8px;
          font-size: 14px;
          line-height: 18px;
          color: #333;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        .legend i {
          width: 14px;
          height: 14px;
          float: left;
          margin-right: 6px;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        var map = L.map('map', { attributionControl: false })
          .setView([${location?.latitude || 27.7172}, ${location?.longitude || 85.324}], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var reports = ${JSON.stringify(reports)};

        function getColor(priority) {
          switch(priority) {
            case "High": return "red";
            case "Medium": return "orange";
            case "Low": return "green";
            default: return "blue";
          }
        }

        reports.forEach(r => {
          var marker = L.circleMarker([r.latitude, r.longitude], {
            radius: 8,
            fillColor: getColor(r.priority),
            color: "#333",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map);
          marker.bindPopup(
            "<div class='popup-title'>" + r.type + "</div>" +
            "<div>" + r.description + "</div>" +
            "<div>Priority: " + r.priority + "</div>" +
            "<div>Status: " + r.status + "</div>"+
            (r.image ? "<div><img src='" + r.image + "' alt='Report Image' style='width:100%;height:auto;margin-top:5px;'/></div>" : "")
          );
        });

        // Add current location marker
        ${
          location
            ? `L.circleMarker([${location.latitude}, ${location.longitude}], {
                radius: 6,
                fillColor: "#2563eb",
                color: "#1d4ed8",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }).addTo(map).bindPopup("You are here");`
            : ""
        }

        // Add Legend
        var legend = L.control({position: "bottomright"});
        legend.onAdd = function (map) {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Severity</h4>";
          div.innerHTML += '<i style="background: red"></i> High<br>';
          div.innerHTML += '<i style="background: orange"></i> Medium<br>';
          div.innerHTML += '<i style="background: green"></i> Low<br>';
          return div;
        };
        legend.addTo(map);
      </script>
    </body>
    </html>
  `

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={{ html: leafletHTML }} style={styles.map} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
})
