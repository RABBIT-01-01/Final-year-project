"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Calendar, AlertTriangle, X } from "lucide-react"

// Mock hazard data
const hazards = [
   {
    id: 1,
    lat: 27.7020,
    lng: 85.3228,
    type: "Pothole",
    description: "Deep pothole near Thamel causing vehicle damage",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-05T14:30:00Z",
    reporter: "Ramesh Shrestha",
  },
  {
    id: 2,
    lat: 27.7125,
    lng: 85.3266,
    type: "Debris",
    description: "Brick debris from construction near New Road",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-05T13:10:00Z",
    reporter: "Mina Lama",
  },
  {
    id: 3,
    lat: 27.7150,
    lng: 85.3200,
    type: "Water Logging",
    description: "Flooded area after monsoon rain in Lazimpat",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-05T11:45:00Z",
    reporter: "Bikash Karki",
  },
  {
    id: 4,
    lat: 27.7215,
    lng: 85.3333,
    type: "Road Crack",
    description: "Surface crack forming on road near Putalisadak",
    severity: "Low",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-05T10:05:00Z",
    reporter: "Sabina Maharjan",
  },
  {
    id: 5,
    lat: 27.7141,
    lng: 85.3175,
    type: "Blocked Drain",
    description: "Clogged drainage causing water overflow in Durbar Marg",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-05T09:30:00Z",
    reporter: "Dipesh Thapa",
  },
  {
    id: 6,
    lat: 27.7190,
    lng: 85.3100,
    type: "Pothole",
    description: "Dangerous pothole near Sorhakhutte",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T16:20:00Z",
    reporter: "Nirajan Basnet",
  },
  {
    id: 7,
    lat: 27.7132,
    lng: 85.3342,
    type: "Construction Obstruction",
    description: "Uncovered sewer line near Bagbazar",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T15:00:00Z",
    reporter: "Asha Manandhar",
  },
  {
    id: 8,
    lat: 27.7115,
    lng: 85.3290,
    type: "Manhole Issue",
    description: "Open manhole near Ratna Park",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T14:10:00Z",
    reporter: "Sunil Bhandari",
  },
  {
    id: 9,
    lat: 27.7201,
    lng: 85.3211,
    type: "Oil Spill",
    description: "Slippery road due to oil near Naxal",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T12:30:00Z",
    reporter: "Ritu Poudel",
  },
  {
    id: 10,
    lat: 27.7222,
    lng: 85.3165,
    type: "Fallen Tree",
    description: "Tree blocking half the road in Kamaladi",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T11:00:00Z",
    reporter: "Govinda Thapa",
  },
  {
    id: 11,
    lat: 27.7184,
    lng: 85.3289,
    type: "Garbage Overflow",
    description: "Overflowing garbage bins near Bhotahity",
    severity: "Low",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-04T10:15:00Z",
    reporter: "Laxmi Neupane",
  },
  {
    id: 12,
    lat: 27.7235,
    lng: 85.3199,
    type: "Road Block",
    description: "Protest causing road block in Maitighar",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T17:30:00Z",
    reporter: "Rajeev Shakya",
  },
  {
    id: 13,
    lat: 27.7160,
    lng: 85.3122,
    type: "Faded Road Markings",
    description: "Crosswalk lines faded near Kalimati",
    severity: "Low",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T16:40:00Z",
    reporter: "Nisha Joshi",
  },
  {
    id: 14,
    lat: 27.7108,
    lng: 85.3217,
    type: "Speed Bump Damage",
    description: "Broken speed bump near Sundhara",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T15:10:00Z",
    reporter: "Anil Khadka",
  },
  {
    id: 15,
    lat: 27.7199,
    lng: 85.3271,
    type: "Sidewalk Obstruction",
    description: "Vendors blocking sidewalk in Ason",
    severity: "Low",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T13:55:00Z",
    reporter: "Sharmila KC",
  },
  {
    id: 16,
    lat: 27.7242,
    lng: 85.3233,
    type: "Traffic Light Malfunction",
    description: "Lights not working at Dilli Bazaar intersection",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T12:00:00Z",
    reporter: "Kiran Ghimire",
  },
  {
    id: 17,
    lat: 27.7112,
    lng: 85.3188,
    type: "Dust Pollution",
    description: "Uncovered road releasing dust near Tripureshwor",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T11:10:00Z",
    reporter: "Rojina Maharjan",
  },
  {
    id: 18,
    lat: 27.7260,
    lng: 85.3312,
    type: "Broken Signage",
    description: "Road sign fallen at Gaushala",
    severity: "Low",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T10:00:00Z",
    reporter: "Manoj Pokharel",
  },
  {
    id: 19,
    lat: 27.7139,
    lng: 85.3251,
    type: "Blocked Road",
    description: "Truck blocking narrow street near Basantapur",
    severity: "High",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T09:00:00Z",
    reporter: "Krishna Lama",
  },
  {
    id: 20,
    lat: 27.7177,
    lng: 85.3300,
    type: "Leakage",
    description: "Water pipe leakage near Bhadrakali",
    severity: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2024-07-03T08:15:00Z",
    reporter: "Sandhya Giri",
  },
]

function MapView() {
  const [selectedHazard, setSelectedHazard] = useState(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      // Check if Leaflet is available (loaded from CDN)
      if (typeof window !== "undefined" && window.L && mapRef.current) {
        // Clear any existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        const L = window.L

        // Create map instance
        const map = L.map(mapRef.current, {
          center: [27.7172, 85.324],
          zoom: 13,
          zoomControl: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map)

        // Store map instance
        mapInstanceRef.current = map

        // Add markers for each hazard
        hazards.forEach((hazard) => {
          // Create custom icon based on severity
          const iconColor = hazard.severity === "High" ? "red" : hazard.severity === "Medium" ? "orange" : "green"

          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          const marker = L.marker([hazard.lat, hazard.lng], { icon: customIcon })
            .addTo(map)
            .on("click", () => {
              setSelectedHazard(hazard)
            })

          // Custom popup content
          const popupContent = `
            <div style="min-width: 200px; font-family: inherit;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${hazard.type}</h3>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${hazard.description}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="padding: 2px 8px; border-radius: 12px; font-size: 11px; background-color: ${
                  hazard.severity === "High"
                    ? "#fee2e2; color: #dc2626"
                    : hazard.severity === "Medium"
                      ? "#fef3c7; color: #d97706"
                      : "#dcfce7; color: #16a34a"
                };">${hazard.severity}</span>
                <span style="font-size: 11px; color: #6b7280;">${new Date(hazard.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          `

          marker.bindPopup(popupContent)
        })

        // Fit map to show all markers
        if (hazards.length > 0) {
          const group = new L.featureGroup(map._layers)
          if (Object.keys(group._layers).length > 0) {
            map.fitBounds(group.getBounds().pad(0.1))
          }
        }
      }
    }

    // Wait for Leaflet to load if not already available
    if (window.L) {
      initMap()
    } else {
      // Poll for Leaflet availability
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          clearInterval(checkLeaflet)
          initMap()
        }
      }, 100)

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkLeaflet), 10000)
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "badge badge-danger"
      case "Medium":
        return "badge badge-warning"
      case "Low":
        return "badge badge-success"
      default:
        return "badge badge-secondary"
    }
  }

  return (
    <div className="flex flex-1 h-full">
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{
            minHeight: "600px",
            zIndex: 1,
            backgroundColor: "#f3f4f6", // Fallback background
          }}
        />

        {/* Map Legend */}
        <div className="absolute top-4 right-4 w-64 card" style={{ zIndex: 1000 }}>
          <div className="card-header">
            <h3 className="text-sm font-semibold">Hazard Legend</h3>
          </div>
          <div className="card-content space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">High Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Medium Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Low Severity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Details Panel */}
      {selectedHazard && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hazard Details</h3>
            <button className="btn btn-ghost btn-icon-sm" onClick={() => setSelectedHazard(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <img
                src={selectedHazard.image || "/placeholder.svg?height=200&width=300"}
                alt={selectedHazard.type}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div>
              <h4 className="font-medium text-lg">{selectedHazard.type}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedHazard.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Severity:</span>
              <span className={getSeverityColor(selectedHazard.severity)}>{selectedHazard.severity}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm">
                {selectedHazard.lat.toFixed(4)}, {selectedHazard.lng.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Reported:</span>
              <span className="text-sm">{new Date(selectedHazard.timestamp).toLocaleString()}</span>
            </div>

            <div>
              <span className="text-sm font-medium">Reporter:</span>
              <span className="text-sm ml-2">{selectedHazard.reporter}</span>
            </div>

            <div className="pt-4 space-y-2">
              <button className="btn btn-primary w-full">Mark as Resolved</button>
              <button className="btn btn-secondary w-full">Assign to Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
