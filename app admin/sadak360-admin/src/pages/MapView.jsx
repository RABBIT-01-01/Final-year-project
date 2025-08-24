"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, AlertTriangle, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const teams = ["Pothole", "Electricity", "Flood", "Traffic jam", "Emergency"];
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fetch hazards from API
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/");
        if (!response.ok) throw new Error("Failed to fetch hazard data");
        const data = await response.json();

        const transformed = data.map((item) => ({
          lat: Math.round(parseFloat(item.coordinates.latitude) * 1e4) / 1e4,
          lng: Math.round(parseFloat(item.coordinates.longitude) * 1e4) / 1e4,
          status: item.status,
          type: item.issueType,
          description: item.description,
          severity: item.severityLevel,
          image: item.image,
          timestamp: item.createdAt,
          reporter: item.reportedBy.fullname,
          maintainance_team: item.maintainance_team || "Unassigned",
          id: item._id,
        }));

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

  const ResolvedHazard = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "solved" }),
      });
      if (!response.ok) throw new Error("Failed to update hazard status");
      const updatedHazard = await response.json();
      const newStatus = updatedHazard.status || "solved";

      setSelectedHazard((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus } : prev
      );

      setHazards((prev) =>
        prev.map((h) => (h.id === id ? { ...h, status: newStatus } : h))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update hazard status.");
    }
  };

  const assignToTeam = async (hazardId, team) => {
    try {
      const response = await fetch(`http://localhost:4000/api/requests/${hazardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintainance_team: team }),
      });
      if (!response.ok) throw new Error("Failed to assign team");
      const updatedHazard = await response.json();

      setSelectedHazard((prev) =>
        prev && prev.id === hazardId ? { ...prev, assignedTeam: team } : prev
      );

      setHazards((prev) =>
        prev.map((h) => (h.id === hazardId ? { ...h, assignedTeam: team } : h))
      );

      setShowAssignModal(false);
      setSelectedTeam("");
    } catch (err) {
      console.error(err);
      setError("Failed to assign team.");
    }
  };

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
    return R * c;
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
        <div ref={mapRef} className="w-full h-full" style={{ minHeight: "600px" }} />
      </div>

      {selectedHazard && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hazard Details</h3>
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={() => (setSelectedHazard(null),setShowAssignModal(false))}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <img
              src={
                selectedHazard.image
                  ? `http://localhost:4000/api/${selectedHazard.image.replace(/^\//, "")}`
                  : "/placeholder.svg"
              }
              alt={selectedHazard.type}
              className="w-full h-48 object-cover rounded-lg"
            />

            <div>
              <h4 className="font-medium text-lg">{selectedHazard.type}</h4>
              <h4
                className={`font-medium text-lg px-3 py-1 rounded-md inline-block ${
                  selectedHazard.status === "pending"
                    ? "bg-red-500 text-red-800"
                    : "bg-green-500 text-green-800"
                }`}
              >
                {selectedHazard.status}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{selectedHazard.description}</p>
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

             <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">assigned to:</span>
              <span className="text-sm">
                {selectedHazard.maintainance_team}
              </span>
            </div>

            <div>
              <span className="text-sm font-medium">Reporter:</span>
              <span className="text-sm ml-2">{selectedHazard.reporter}</span>
            </div>

            {selectedHazard.assignedTeam && (
              <div>
                <span className="text-sm font-medium">Assigned Team:</span>
                <span className="text-sm ml-2">{selectedHazard.assignedTeam}</span>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => ResolvedHazard(selectedHazard.id)}
              >
                Mark as Resolved
              </button>
              <button
                className="btn btn-secondary w-full"
                onClick={() => setShowAssignModal(true)}
              >
                Assign to Team
              </button>
            </div>
          </div>
        </div>
      )}

       {/* {selectedHazard && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hazard Details</h3> */}

     {showAssignModal && (
  <div className="  flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto ">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative ">
      <h3 className="text-lg font-semibold mb-4">Assign here</h3>
      <select
        className="w-full border rounded-md p-2 mb-4"
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">-- Select maintainance team --</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>
            {team}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-ghost"
          onClick={() => setShowAssignModal(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          disabled={!selectedTeam}
          onClick={() => assignToTeam(selectedHazard.id, selectedTeam)}
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
