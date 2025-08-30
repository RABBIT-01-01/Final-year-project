import React, { useEffect, useState } from "react"
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Text } from "react-native"
import { WebView } from "react-native-webview"
import * as Location from "expo-location"
import URL from "../config"

export default function MapScreen({ route }) {
  const { maintenanceTeam } = route.params || {}
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Get current location
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
  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://${URL}:4000/api/requests/team/${maintenanceTeam}`)
      const data = await response.json()
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

  useEffect(() => {
    fetchReports()
  }, [maintenanceTeam])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  const leafletHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Maintenance Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #map { height: 100%; width: 100%; }
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
      }
      .popup-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 4px;
        color: #1f2937;
      }
      .popup-description { font-size: 14px; color: #374151; margin-bottom: 4px; }
      .popup-info { font-size: 13px; color: #4b5563; }
      .popup-image { width: 100%; height: auto; border-radius: 8px; margin-top: 6px; }
      .popup-button {
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 6px 10px;
        margin-top: 8px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
      }
      .legend {
        background: white;
        padding: 12px;
        font-size: 14px;
        line-height: 20px;
        color: #333;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }
      .legend i {
        width: 16px;
        height: 16px;
        float: left;
        margin-right: 6px;
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.min.js"></script>
    <script>
      var map = L.map('map', { attributionControl: false }).setView([${location?.latitude || 27.7172}, ${location?.longitude || 85.324}], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      var reports = ${JSON.stringify(reports)};
      var userLocation = [${location?.latitude || 27.7172}, ${location?.longitude || 85.324}];
      var routeControl = null;

      function getColor(priority) {
        switch(priority) {
          case "High": return "#ef4444";
          case "Medium": return "#f59e0b";
          case "Low": return "#10b981";
          default: return "#3b82f6";
        }
      }

      // User location marker
      var userMarker = L.marker(userLocation, { icon: L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", iconSize: [32, 32] }) })
        .addTo(map).bindPopup("<b>You are here</b>");

      // Report markers
      reports.forEach((r, index) => {
        var marker = L.circleMarker([r.latitude, r.longitude], {
          radius: 10,
          fillColor: getColor(r.priority),
          color: "#111827",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(
          "<div class='popup-title'>" + r.type + "</div>" +
          "<div class='popup-description'>" + r.description + "</div>" +
          "<div class='popup-info'>Priority: " + r.priority + "<br>Status: " + r.status + "</div>" +
          (r.image ? "<img class='popup-image' src='" + r.image + "' />" : "") +
          "<button class='popup-button' onclick='drawRoute(" + index + ")'>Show Path</button>"
        );
      });

      function drawRoute(index) {
        var r = reports[index];
        if (routeControl) map.removeControl(routeControl);
        routeControl = L.Routing.control({
          waypoints: [ L.latLng(userLocation[0], userLocation[1]), L.latLng(r.latitude, r.longitude) ],
          lineOptions: { styles: [{ color: '#2563eb', opacity: 0.7, weight: 5 }] },
          createMarker: () => null,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true
        }).addTo(map);
      }

      // Legend
      var legend = L.control({position: "bottomright"});
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += "<h4>Severity</h4>";
        div.innerHTML += '<i style="background:#ef4444"></i> High<br>';
        div.innerHTML += '<i style="background:#f59e0b"></i> Medium<br>';
        div.innerHTML += '<i style="background:#10b981"></i> Low<br>';
        return div;
      };
      legend.addTo(map);
    </script>
  </body>
  </html>
  `

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchReports}>
        <Text style={styles.refreshText}>🔄 Refresh</Text>
      </TouchableOpacity>
      <WebView originWhitelist={["*"]} source={{ html: leafletHTML }} style={styles.map} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  refreshButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  refreshText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
})
