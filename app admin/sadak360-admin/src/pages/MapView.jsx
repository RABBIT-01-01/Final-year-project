// "use client"

// import { useState, useRef, useEffect } from "react"
// import { MapPin, Calendar, AlertTriangle, X } from "lucide-react"

// // Mock hazard data
// // const hazards = [
// //    {
// //     id: 1,
// //     coordinates.latitude: 27.7020,
// //     coordinates.longitude: 85.3228,
// //     issueType: "Pothole",
// //     description: "Deep pothole near Thamel causing vehicle damage",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-05T14:30:00Z",
// //     reportedBy.fullname: "Ramesh Shrestha",
// //   },
// //   {
// //     id: 2,
// //     coordinates.latitude: 27.7125,
// //     coordinates.longitude: 85.3266,
// //     issueType: "Debris",
// //     description: "Brick debris from construction near New Road",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-05T13:10:00Z",
// //     reportedBy.fullname: "Mina Lama",
// //   },
// //   {
// //     id: 3,
// //     coordinates.latitude: 27.7150,
// //     coordinates.longitude: 85.3200,
// //     issueType: "Water Logging",
// //     description: "Flooded area after monsoon rain in Lazimpat",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-05T11:45:00Z",
// //     reportedBy.fullname: "Bikash Karki",
// //   },
// //   {
// //     id: 4,
// //     coordinates.latitude: 27.7215,
// //     coordinates.longitude: 85.3333,
// //     issueType: "Road Crack",
// //     description: "Surface crack forming on road near Putalisadak",
// //     severityLevel: "Low",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-05T10:05:00Z",
// //     reportedBy.fullname: "Sabina Maharjan",
// //   },
// //   {
// //     id: 5,
// //     coordinates.latitude: 27.7141,
// //     coordinates.longitude: 85.3175,
// //     issueType: "Blocked Drain",
// //     description: "Clogged drainage causing water overflow in Durbar Marg",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-05T09:30:00Z",
// //     reportedBy.fullname: "Dipesh Thapa",
// //   },
// //   {
// //     id: 6,
// //     coordinates.latitude: 27.7190,
// //     coordinates.longitude: 85.3100,
// //     issueType: "Pothole",
// //     description: "Dangerous pothole near Sorhakhutte",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T16:20:00Z",
// //     reportedBy.fullname: "Nirajan Basnet",
// //   },
// //   {
// //     id: 7,
// //     coordinates.latitude: 27.7132,
// //     coordinates.longitude: 85.3342,
// //     issueType: "Construction Obstruction",
// //     description: "Uncovered sewer line near Bagbazar",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T15:00:00Z",
// //     reportedBy.fullname: "Asha Manandhar",
// //   },
// //   {
// //     id: 8,
// //     coordinates.latitude: 27.7115,
// //     coordinates.longitude: 85.3290,
// //     issueType: "Manhole Issue",
// //     description: "Open manhole near Ratna Park",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T14:10:00Z",
// //     reportedBy.fullname: "Sunil Bhandari",
// //   },
// //   {
// //     id: 9,
// //     coordinates.latitude: 27.7201,
// //     coordinates.longitude: 85.3211,
// //     issueType: "Oil Spill",
// //     description: "Slippery road due to oil near Naxal",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T12:30:00Z",
// //     reportedBy.fullname: "Ritu Poudel",
// //   },
// //   {
// //     id: 10,
// //     coordinates.latitude: 27.7222,
// //     coordinates.longitude: 85.3165,
// //     issueType: "Fallen Tree",
// //     description: "Tree blocking half the road in Kamaladi",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T11:00:00Z",
// //     reportedBy.fullname: "Govinda Thapa",
// //   },
// //   {
// //     id: 11,
// //     coordinates.latitude: 27.7184,
// //     coordinates.longitude: 85.3289,
// //     issueType: "Garbage Overflow",
// //     description: "Overflowing garbage bins near Bhotahity",
// //     severityLevel: "Low",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-04T10:15:00Z",
// //     reportedBy.fullname: "Laxmi Neupane",
// //   },
// //   {
// //     id: 12,
// //     coordinates.latitude: 27.7235,
// //     coordinates.longitude: 85.3199,
// //     issueType: "Road Block",
// //     description: "Protest causing road block in Maitighar",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T17:30:00Z",
// //     reportedBy.fullname: "Rajeev Shakya",
// //   },
// //   {
// //     id: 13,
// //     coordinates.latitude: 27.7160,
// //     coordinates.longitude: 85.3122,
// //     issueType: "Faded Road Markings",
// //     description: "Crosswalk lines faded near Kalimati",
// //     severityLevel: "Low",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T16:40:00Z",
// //     reportedBy.fullname: "Nisha Joshi",
// //   },
// //   {
// //     id: 14,
// //     coordinates.latitude: 27.7108,
// //     coordinates.longitude: 85.3217,
// //     issueType: "Speed Bump Damage",
// //     description: "Broken speed bump near Sundhara",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T15:10:00Z",
// //     reportedBy.fullname: "Anil Khadka",
// //   },
// //   {
// //     id: 15,
// //     coordinates.latitude: 27.7199,
// //     coordinates.longitude: 85.3271,
// //     issueType: "Sidewalk Obstruction",
// //     description: "Vendors blocking sidewalk in Ason",
// //     severityLevel: "Low",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T13:55:00Z",
// //     reportedBy.fullname: "Sharmila KC",
// //   },
// //   {
// //     id: 16,
// //     coordinates.latitude: 27.7242,
// //     coordinates.longitude: 85.3233,
// //     issueType: "Traffic Light Malfunction",
// //     description: "Lights not working at Dilli Bazaar intersection",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T12:00:00Z",
// //     reportedBy.fullname: "Kiran Ghimire",
// //   },
// //   {
// //     id: 17,
// //     coordinates.latitude: 27.7112,
// //     coordinates.longitude: 85.3188,
// //     issueType: "Dust Pollution",
// //     description: "Uncovered road releasing dust near Tripureshwor",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T11:10:00Z",
// //     reportedBy.fullname: "Rojina Maharjan",
// //   },
// //   {
// //     id: 18,
// //     coordinates.latitude: 27.7260,
// //     coordinates.longitude: 85.3312,
// //     issueType: "Broken Signage",
// //     description: "Road sign fallen at Gaushala",
// //     severityLevel: "Low",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T10:00:00Z",
// //     reportedBy.fullname: "Manoj Pokharel",
// //   },
// //   {
// //     id: 19,
// //     coordinates.latitude: 27.7139,
// //     coordinates.longitude: 85.3251,
// //     issueType: "Blocked Road",
// //     description: "Truck blocking narrow street near Basantapur",
// //     severityLevel: "High",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T09:00:00Z",
// //     reportedBy.fullname: "Krishna Lama",
// //   },
// //   {
// //     id: 20,
// //     coordinates.latitude: 27.7177,
// //     coordinates.longitude: 85.3300,
// //     issueType: "Leakage",
// //     description: "Water pipe leakage near Bhadrakali",
// //     severityLevel: "Medium",
// //     image: "/placeholder.svg?height=200&width=300",
// //     createdAt: "2024-07-03T08:15:00Z",
// //     reportedBy.fullname: "Sandhya Giri",
// //   },
// // ]

// // API endpoint
// const API_URL = "http://localhost:4000/api/requests/"

// function MapView() {
//   const [hazards, setHazards] = useState([]) // fetched hazards
//   const [selectedHazard, setSelectedHazard] = useState(null)
//   const mapRef = useRef(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const mapInstanceRef = useRef(null)


//     // Fetch hazard data from API
//   useEffect(() => {
//     const fetchHazards = async () => {
//       try {
//         const res = await fetch(API_URL)
//         if (!res.ok) throw new Error("Failed to fetch hazards")
//         const data = await res.json()
//         console.log("Fetched hazards:", data)
//         setHazards(data)
//         setLoading(false)
//       } catch (err) {
//         console.error(err)
//         setError("Unable to load hazard data")
//         setLoading(false)
//       }
//     }

//     fetchHazards()
//   }, [])


//   useEffect(() => {
//     if (!loading && !error && hazards.length > 0) {
//       // Initialize map after hazards load
//       const initMap = () => {
//         if (typeof window !== "undefined" && window.L && mapRef.current) {
//           if (mapInstanceRef.current) {
//             mapInstanceRef.current.remove()
//           }

//           const L = window.L
//           const map = L.map(mapRef.current, {
//             center: [27.7172, 85.324],
//             zoom: 13,
//             zoomControl: true,
//           })

//           L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//             attribution: "© OpenStreetMap contributors",
//             maxZoom: 19,
//           }).addTo(map)

//           mapInstanceRef.current = map

//           hazards.forEach((hazard) => {
//             const iconColor =
//               hazard.severityLevel === "High"
//                 ? "red"
//                 : hazard.severityLevel === "Medium"
//                 ? "orange"
//                 : "green"

//             const customIcon = L.divIcon({
//               className: "custom-marker",
//               html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
//               iconSize: [20, 20],
//               iconAnchor: [10, 10],
//             })

//             const marker = L.marker([hazard.coordinates.latitude, hazard.coordinates.longitude], { icon: customIcon })
//               .addTo(map)
//               .on("click", () => setSelectedHazard(hazard))

//             const popupContent = `
//               <div style="min-width: 200px; font-family: inherit;">
//                 <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${hazard.issueType}</h3>
//                 <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${hazard.description}</p>
//                 <div style="display: flex; justify-content: space-between; align-items: center;">
//                   <span style="padding: 2px 8px; border-radius: 12px; font-size: 11px; background-color: ${
//                     hazard.severityLevel === "High"
//                       ? "#fee2e2; color: #dc2626"
//                       : hazard.severityLevel === "Medium"
//                       ? "#fef3c7; color: #d97706"
//                       : "#dcfce7; color: #16a34a"
//                   };">${hazard.severityLevel}</span>
//                   <span style="font-size: 11px; color: #6b7280;">${new Date(
//                     hazard.createdAt
//                   ).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             `
//             marker.bindPopup(popupContent)
//           })

//           if (hazards.length > 0) {
//             const group = new L.featureGroup(map._layers)
//             if (Object.keys(group._layers).length > 0) {
//               map.fitBounds(group.getBounds().pad(0.1))
//             }
//           }
//         }
//       }

//       if (window.L) {
//         initMap()
//       } else {
//         const checkLeaflet = setInterval(() => {
//           if (window.L) {
//             clearInterval(checkLeaflet)
//             initMap()
//           }
//         }, 100)
//         setTimeout(() => clearInterval(checkLeaflet), 10000)
//       }
//     }
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove()
//         mapInstanceRef.current = null
//       }
//     }
//   }, [hazards, loading, error])

//   const getSeverityColor = (severityLevel) => {
//     switch (severityLevel) {
//       case "High":
//         return "badge badge-danger"
//       case "Medium":
//         return "badge badge-warning"
//       case "Low":
//         return "badge badge-success"
//       default:
//         return "badge badge-secondary"
//     }
//   }

//   return (
//     <div className="flex flex-1 h-full">
//       <div className="flex-1 relative">
//         {loading && (
//           <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-50">
//             <span>Loading hazards...</span>
//           </div>
//         )}
//         {error && (
//           <div className="absolute inset-0 flex justify-center items-center bg-red-100 text-red-500 z-50">
//             <span>{error}</span>
//           </div>
//         )}
//         <div
//           ref={mapRef}
//           className="w-full h-full"
//           style={{
//             minHeight: "600px",
//             zIndex: 1,
//             backgroundColor: "#f3f4f6",
//           }}
//         />

//         {/* Map Legend */}
//         {!loading && !error && (
//           <div className="absolute top-4 right-4 w-64 card" style={{ zIndex: 1000 }}>
//             <div className="card-header">
//               <h3 className="text-sm font-semibold">Hazard Legend</h3>
//             </div>
//             <div className="card-content space-y-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm">High severityLevel</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 <span className="text-sm">Medium severityLevel</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span className="text-sm">Low severityLevel</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Hazard Details Panel */}
//       {selectedHazard && (
//         <div className="w-80 border-l bg-white p-4 overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Hazard Details</h3>
//             <button className="btn btn-ghost btn-icon-sm" onClick={() => setSelectedHazard(null)}>
//               <X className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <img
//                 src={selectedHazard.image || "/placeholder.svg?height=200&width=300"}
//                 alt={selectedHazard.issueType}
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//             </div>

//             <div>
//               <h4 className="font-medium text-lg">{selectedHazard.issueType}</h4>
//               <p className="text-sm text-gray-600 mt-1">{selectedHazard.description}</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <AlertTriangle className="h-4 w-4" />
//               <span className="text-sm font-medium">severityLevel:</span>
//               <span className={getSeverityColor(selectedHazard.severityLevel)}>{selectedHazard.severityLevel}</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <MapPin className="h-4 w-4" />
//               <span className="text-sm font-medium">Location:</span>
//               <span className="text-sm">
//                 {selectedHazard.location}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               <span className="text-sm font-medium">Reported:</span>
//               <span className="text-sm">{new Date(selectedHazard.createdAt).toLocaleString()}</span>
//             </div>

//             <div>
//               <span className="text-sm font-medium">reportedBy.fullname:</span>
//               <span className="text-sm ml-2">{selectedHazard.reportedBy.fullname}</span>
//             </div>

//             <div className="pt-4 space-y-2">
//               <button className="btn btn-primary w-full">Mark as Resolved</button>
//               <button className="btn btn-secondary w-full">Assign to Team</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default MapView






"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, AlertTriangle, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fetch hazards from API
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/");
        if (!response.ok) throw new Error("Failed to fetch hazard data");
        const data = await response.json();

        // Transform API data to match our hazard structure
        const transformed = data.map((item) => ({
          lat: Math.round(parseFloat(item.coordinates.latitude) * 1e4) / 1e4,
          lng: Math.round(parseFloat(item.coordinates.longitude) * 1e4) / 1e4,

          type: item.issueType,
          description: item.description,
          severity: item.severityLevel,
          image: item.image,
          timestamp: item.createdAt,
          reporter: item.reportedBy.fullname,
        }));
        console.log("Fetched hazards:", transformed);
        setHazards(transformed);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load hazard data.");
        setLoading(false);
      }
    };

    fetchHazards();
  }, []);

  // Utility: Haversine formula to calculate distance
  const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(`Distance between (${lat1}, ${lng1}) and (${lat2}, ${lng2}): ${R * c} km`);
    return R * c;
  };

  // Cluster hazards based on zoom level
  const clusterHazards = (hazards, zoom) => {
    const threshold =
  zoom >= 16 ? 0 : // No clustering at high zoom
  zoom >= 14 ? 0.3 : // Fine clustering
  zoom >= 12 ? 0.7 : // Medium clustering
  zoom >= 10 ? 5 : // Coarse clustering
  zoom >= 8 ? 10 : // Wider clustering
  20; // Very wide clustering for global zoom
    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < hazards.length; i++) {
      if (visited.has(i)) continue;
      const cluster = [hazards[i]];
      visited.add(i);
      for (let j = i + 1; j < hazards.length; j++) {
        if (visited.has(j)) continue;
        const dist = haversineDistance(
          hazards[i].lat,
          hazards[i].lng,
          hazards[j].lat,
          hazards[j].lng
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

  const createMarkers = (map, zoom) => {
    const L = window.L;
    const clusters = clusterHazards(hazards, zoom);

    clusters.forEach((cluster) => {
      if (cluster.length === 1) {
        const hazard = cluster[0];
        const iconColor =
          hazard.severity === "High"
            ? "red"
            : hazard.severity === "Medium"
            ? "orange"
            : "green";

        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([hazard.lat, hazard.lng], { icon: customIcon })
          .addTo(map)
          .on("click", () => {
            setSelectedHazard(hazard);
          });

        marker.bindTooltip(hazard.type);
      } else {
        const latAvg = cluster.reduce((sum, h) => sum + h.lat, 0) / cluster.length;
        const lngAvg = cluster.reduce((sum, h) => sum + h.lng, 0) / cluster.length;

        const clusterIcon = L.divIcon({
          html: `<div style="background-color: #4B5563; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 12px;">${cluster.length}</div>`,
          className: "cluster-marker",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([latAvg, lngAvg], { icon: clusterIcon }).addTo(map);
      }
    });
  };

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || !window.L || !mapRef.current) return;
    if (loading || error) return;

    const L = window.L;
    const map = L.map(mapRef.current).setView([27.7172, 85.324], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    const render = () => {
      // Remove all markers but keep tile layers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && !layer._iconUrl) {
          map.removeLayer(layer);
        }
      });
      createMarkers(map, map.getZoom());
    };

    map.on("zoomend", render);
    render();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [hazards, loading, error]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "badge badge-danger";
      case "Medium":
        return "badge badge-warning";
      case "Low":
        return "badge badge-success";
      default:
        return "badge badge-secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading hazard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full">
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: "600px" }}
        />
      </div>
      {selectedHazard && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hazard Details</h3>
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={() => setSelectedHazard(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <img
              src={selectedHazard.image}
              alt={selectedHazard.type}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium text-lg">{selectedHazard.type}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedHazard.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Severity:</span>
              <span className={getSeverityColor(selectedHazard.severity)}>
                {selectedHazard.severity}
              </span>
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
              <span className="text-sm">
                {new Date(selectedHazard.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Reporter:</span>
              <span className="text-sm ml-2">{selectedHazard.reporter}</span>
            </div>
            <div className="pt-4 space-y-2">
              <button className="btn btn-primary w-full">
                Mark as Resolved
              </button>
              <button className="btn btn-secondary w-full">
                Assign to Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

