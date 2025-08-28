import React, { useEffect, useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { WebView } from "react-native-webview"
import * as Location from "expo-location"

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  const reports = [
    {
      id: "1",
      type: "Pothole",
      description: "Large pothole causing vehicle damage",
      latitude: 27.7172,
      longitude: 85.324,
      priority: "High",
      status: "In Progress",
    },
    {
      id: "2",
      type: "Debris",
      description: "Tree branch blocking lane",
      latitude: 27.72,
      longitude: 85.328,
      priority: "Critical",
      status: "Reported",
    },
    {
      id: "3",
      type: "Sign Damage",
      description: "Stop sign knocked over",
      latitude: 27.715,
      longitude: 85.321,
      priority: "Medium",
      status: "Resolved",
    },
    {
      id: "4",
      type: "Crack",
      description: "Small road crack, not urgent",
      latitude: 27.713,
      longitude: 85.326,
      priority: "Low",
      status: "Reported",
    },
  ]

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
        var map = L.map('map' ,  { attributionControl: false }).setView([${location?.latitude || 27.7172}, ${location?.longitude || 85.324}], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var reports = ${JSON.stringify(reports)};

        function getColor(priority) {
          switch(priority) {
            case "Critical": return "black";
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
            "<div>Status: " + r.status + "</div>"
          );
        });

        // Add current location marker
        ${
          location
            ? `
          var userMarker = L.circleMarker([${location.latitude}, ${location.longitude}], {
            radius: 6,
            fillColor: "#2563eb",
            color: "#1d4ed8",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map).bindPopup("You are here");
        `
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
