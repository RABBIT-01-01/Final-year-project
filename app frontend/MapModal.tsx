"use client"

import { useState, useRef, useEffect } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native"
import { WebView } from "react-native-webview"
import * as Location from "expo-location"

const MapModal = ({ visible, onClose, onLocationSelect, initialLocation }) => {
  const webViewRef = useRef(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState(null)

  // Request location permissions when modal opens
  useEffect(() => {
    if (visible) {
      requestLocationPermission()
    }
  }, [visible])

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(status === "granted")

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Location.requestForegroundPermissionsAsync() },
          ],
        )
      }
    } catch (error) {
      console.error("Error requesting location permission:", error)
      setLocationPermission(false)
    }
  }

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert("Location Permission Denied", "Please enable location permissions in your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Request Permission", onPress: requestLocationPermission },
      ])
      return
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      })

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      }

      setCurrentLocation(locationData)

      // Send location to WebView using injectedJavaScript
      const jsCode = `
        if (typeof setCurrentLocationFromNative === 'function') {
          setCurrentLocationFromNative(${locationData.latitude}, ${locationData.longitude}, ${locationData.accuracy});
        }
        true; // Required for injectedJavaScript
      `

      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(jsCode)
      }
    } catch (error) {
      console.error("Error getting current location:", error)
      Alert.alert(
        "Location Error",
        "Failed to get your current location. Please make sure location services are enabled and try again.",
      )
    }
  }

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Select Location</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .leaflet-control-attribution { display: none; }
            .draggable-marker {
                cursor: move !important;
            }
            .location-info {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.95);
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 12px;
                z-index: 1000;
            }
            .current-location-btn {
                position: absolute;
                top: 70px;
                right: 10px;
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .current-location-btn:hover {
                background: #0056CC;
            }
            .current-location-btn:disabled {
                background: #999;
                cursor: not-allowed;
            }
            .initial-prompt {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                z-index: 1001;
                max-width: 280px;
            }
            .initial-prompt h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
                color: #333;
            }
            .initial-prompt p {
                margin: 0 0 20px 0;
                font-size: 14px;
                color: #666;
                line-height: 1.4;
            }
            .prompt-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .prompt-btn {
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .prompt-btn-primary {
                background: #007AFF;
                color: white;
            }
            .prompt-btn-primary:hover {
                background: #0056CC;
            }
            .prompt-btn-secondary {
                background: #f0f0f0;
                color: #333;
            }
            .prompt-btn-secondary:hover {
                background: #e0e0e0;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <button id="currentLocationBtn" class="current-location-btn" title="Get Current Location">🎯</button>
        <div id="locationInfo" class="location-info" style="display: none;">
            <div><strong>📍 Drag the pin to fine-tune location</strong></div>
            <div id="coordinates"></div>
            <div id="accuracy"></div>
        </div>
        <div id="initialPrompt" class="initial-prompt">
            <h3>📍 Select Location</h3>
            <p>Choose how you'd like to set your location for this report</p>
            <div class="prompt-buttons">
                <button id="useCurrentLocationBtn" class="prompt-btn prompt-btn-primary">
                    🎯 Current Location
                </button>
                <button id="selectManuallyBtn" class="prompt-btn prompt-btn-secondary">
                    🗺️ Pick on Map
                </button>
            </div>
        </div>

        <script>
            // Initialize map with default view
            var map = L.map('map').setView([27.7089, 85.3206], 14);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            }).addTo(map);
            
            var marker = null;
            var currentLocationMarker = null;
            var isDragging = false;
            var initialPromptShown = true;
            
            // Custom draggable pin icon
            var draggableIcon = L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3B30"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            
            // Current location pin icon
            var currentLocationIcon = L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007AFF"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                iconSize: [28, 28],
                iconAnchor: [14, 28],
                popupAnchor: [0, -28]
            });
            
            function hideInitialPrompt() {
                var prompt = document.getElementById('initialPrompt');
                if (prompt) {
                    prompt.style.display = 'none';
                    initialPromptShown = false;
                }
            }
            
            function updateLocationInfo(lat, lng, isGPS = false, accuracy = null) {
                var infoDiv = document.getElementById('locationInfo');
                var coordsDiv = document.getElementById('coordinates');
                var accuracyDiv = document.getElementById('accuracy');
                
                coordsDiv.innerHTML = 'Coordinates: ' + lat.toFixed(6) + ', ' + lng.toFixed(6);
                
                if (isGPS && accuracy) {
                    accuracyDiv.innerHTML = 'GPS Accuracy: ±' + Math.round(accuracy) + 'm';
                    accuracyDiv.style.display = 'block';
                } else {
                    accuracyDiv.style.display = 'none';
                }
                
                infoDiv.style.display = 'block';
            }
            
            function reverseGeocode(lat, lng, isGPS = false, accuracy = null) {
                fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng)
                    .then(response => response.json())
                    .then(data => {
                        var address = data.display_name || 'Selected Location';
                        
                        // Send data back to React Native
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'locationSelected',
                                latitude: lat,
                                longitude: lng,
                                address: address,
                                isGPS: isGPS,
                                accuracy: accuracy
                            }));
                        }
                    })
                    .catch(error => {
                        console.error('Geocoding error:', error);
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'locationSelected',
                                latitude: lat,
                                longitude: lng,
                                address: 'Selected Location',
                                isGPS: isGPS,
                                accuracy: accuracy
                            }));
                        }
                    });
            }
            
            function addDraggableMarker(lat, lng, isGPS = false, accuracy = null) {
                console.log('Adding marker at:', lat, lng, 'isGPS:', isGPS, 'accuracy:', accuracy);
                
                // Remove existing marker
                if (marker) {
                    map.removeLayer(marker);
                }
                
                // Add new draggable marker
                marker = L.marker([lat, lng], {
                    icon: draggableIcon,
                    draggable: true
                }).addTo(map);
                
                console.log('Marker added successfully');
                
                // Update location info
                updateLocationInfo(lat, lng, isGPS, accuracy);
                
                // Add drag event listeners
                marker.on('dragstart', function() {
                    isDragging = true;
                });
                
                marker.on('drag', function(e) {
                    var position = e.target.getLatLng();
                    updateLocationInfo(position.lat, position.lng);
                });
                
                marker.on('dragend', function(e) {
                    setTimeout(() => { isDragging = false; }, 100);
                    var position = e.target.getLatLng();
                    reverseGeocode(position.lat, position.lng);
                });
                
                // Initial reverse geocoding
                reverseGeocode(lat, lng, isGPS, accuracy);
            }
            
            // Function to be called from React Native
            window.setCurrentLocationFromNative = function(lat, lng, accuracy) {
                console.log('Received location from native:', lat, lng, accuracy);
                
                // Remove existing current location marker
                if (currentLocationMarker) {
                    map.removeLayer(currentLocationMarker);
                }
                
                // Set map view to current location
                map.setView([lat, lng], 18);
                
                // Add current location marker (non-draggable, for reference)
                currentLocationMarker = L.marker([lat, lng], {
                    icon: currentLocationIcon
                }).addTo(map);
                
                currentLocationMarker.bindPopup('Your current location (±' + Math.round(accuracy) + 'm)').openPopup();
                
                // Add draggable marker at current location for fine-tuning
                addDraggableMarker(lat, lng, true, accuracy);
                
                // Hide initial prompt
                hideInitialPrompt();
            };
            
            // Handle map clicks
            map.on('click', function(e) {
                if (isDragging) return;
                
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;
                
                // Hide initial prompt on first click
                if (initialPromptShown) {
                    hideInitialPrompt();
                }
                
                addDraggableMarker(lat, lng);
            });
            
            // Current location button handler - sends message to React Native
            document.getElementById('currentLocationBtn').addEventListener('click', function() {
                console.log('Current location button clicked');
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'requestCurrentLocation'
                    }));
                }
            });
            
            // Initial prompt button handlers
            document.getElementById('useCurrentLocationBtn').addEventListener('click', function() {
                console.log('Use current location button clicked');
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'requestCurrentLocation'
                    }));
                }
            });
            
            document.getElementById('selectManuallyBtn').addEventListener('click', function() {
                hideInitialPrompt();
            });
            
            // Check if initial location is provided
            var initialLat = ${initialLocation?.latitude || "null"};
            var initialLng = ${initialLocation?.longitude || "null"};
            
            if (initialLat && initialLng) {
                // Hide initial prompt if location is already provided
                hideInitialPrompt();
                
                // Set map view to initial location
                map.setView([initialLat, initialLng], 18);
                
                // Add draggable marker at initial location
                addDraggableMarker(initialLat, initialLng, true);
            }
            
            console.log('Map initialized successfully');
        </script>
    </body>
    </html>
  `

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      console.log("Received message from WebView:", data)

      if (data.type === "locationSelected") {
        setSelectedLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          isGPS: data.isGPS,
          accuracy: data.accuracy,
        })
      } else if (data.type === "requestCurrentLocation") {
        console.log("Location request received from WebView")
        getCurrentLocation()
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.address, {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        accuracy: selectedLocation.accuracy,
      })
    } else {
      Alert.alert("No Location Selected", "Please tap on the map or use current location to select a location")
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity onPress={handleConfirmLocation}>
            <Text style={styles.confirmButton}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={webViewRef}
          source={{ html: mapHTML }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={() => console.log("WebView loaded")}
          onError={(error) => console.error("WebView error:", error)}
        />
        {selectedLocation && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText} numberOfLines={2}>
              📍 {selectedLocation.address}
            </Text>
            <Text style={styles.coordinatesText}>
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
            {selectedLocation.accuracy && (
              <Text style={styles.accuracyText}>GPS Accuracy: ±{Math.round(selectedLocation.accuracy)}m</Text>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  confirmButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  webView: {
    flex: 1,
  },
  locationInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  accuracyText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
})

export default MapModal
