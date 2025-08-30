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
        const response = await fetch("http://localhost:4000/api/requests/", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch hazard data");
        const data = await response.json();
        console.log()
        const transformed = data.map((item) => ({
          id: item._id,
          lat: Math.round(parseFloat(item.coordinates.latitude) * 1e4) / 1e4,
          lng: Math.round(parseFloat(item.coordinates.longitude) * 1e4) / 1e4,
          status: item.status,
          type: item.issueType,
          location: item.location,
          description: item.description,
          severity: item.severityLevel,
          image: item.image,
          timestamp: item.createdAt,
          reporter: item.reportedBy.fullname,
          maintenance_team: item.maintenance_team ,
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
        credentials: "include",
        body: JSON.stringify({ status: "verified" }),
      });
      if (!response.ok) throw new Error("Failed to update hazard status");
      const updatedHazard = await response.json();
      const newStatus = updatedHazard.status || "verified";

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
      console.log("Assigning team:", hazardId, team);
      const response = await fetch(`http://localhost:4000/api/requests/${hazardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ maintenance_team: team }),
      });
      if (!response.ok) throw new Error("Failed to assign team");
      const updatedHazard = await response.json();
      const assignedTeam = updatedHazard.maintenance_team || team;

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
        return "badge bg-danger";
      case "Medium":
        return "badge bg-warning text-dark";
      case "Low":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "solved":
        return "badge bg-secondary";
      case "verified":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center h-100">Loading hazard data...</div>;
  if (error) return <div className="d-flex justify-content-center align-items-center h-100 text-danger">{error}</div>;

  return (
    <div className="d-flex h-100">
  {/* Map */}
  <div className="flex-fill position-relative">
    <div
      ref={mapRef}
      className="w-100 h-100"
      style={{ minHeight: "600px" }}
    />
  </div>

  {/* Hazard Details Side Panel */}
  {selectedHazard && (
    <div
      className="border-start shadow-sm animate__animated animate__slideInRight"
      style={{
        width: "340px",
        background: "linear-gradient(180deg, #f9fafb, #f1f3f6)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
        <h5 className="fw-bold text-primary m-0">⚠ Hazard Details</h5>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => (setSelectedHazard(null), setShowAssignModal(false))}
        >
          <X />
        </button>
      </div>

      <div className="p-3">
        {/* Image */}
        <div className="text-center mb-3">
          <img
            src={
              selectedHazard.image
                ? `http://localhost:4000/api/${selectedHazard.image.replace(
                    /^\//,
                    ""
                  )}`
                : "/placeholder.svg"
            }
            alt={selectedHazard.type}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "180px", objectFit: "cover" }}
          />
        </div>

        {/* Type + Status */}
        <h6 className="fw-bold text-dark">
          {selectedHazard.type}{" "}
          <span
            className={`badge px-2 py-1 ${getStatusColor(
              selectedHazard.status
            )}`}
          >
            {selectedHazard.status}
          </span>
        </h6>
        <p className="text-muted">{selectedHazard.description}</p>

        {/* Details List */}
        <ul className="list-unstyled small">
          <li className="mb-2">
            <AlertTriangle className="me-2 text-warning" /> Severity:{" "}
            <span className={getSeverityColor(selectedHazard.severity)}>
              {selectedHazard.severity}
            </span>
          </li>
          <li className="mb-2">
            <MapPin className="me-2 text-danger" /> Location:{" "}
            {selectedHazard.location.split(",").slice(0, 3).join(" ")}...
          </li>
          <li className="mb-2">
            <Calendar className="me-2 text-primary" /> Reported:{" "}
            {new Date(selectedHazard.timestamp).toLocaleString()}
          </li>
          <li className="mb-2">
            🛠 Management Team:{" "}
            <span className="fw-semibold text-secondary">
              {selectedHazard.maintenance_team || "Unassigned"}
            </span>
          </li>
          <li className="mb-2">👤 Reporter: {selectedHazard.reporter}</li>
          {selectedHazard.assignedTeam && (
            <li className="mb-2">
              ✅ Assigned Team: {selectedHazard.assignedTeam}
            </li>
          )}
        </ul>

        {/* Buttons */}
        <div className="d-grid gap-2 mt-4">
          <button
            className="btn btn-success shadow-sm animate__animated animate__pulse"
            onClick={() => ResolvedHazard(selectedHazard.id)}
          >
            ✔ Mark as Resolved
          </button>
          <button
            className="btn btn-outline-primary shadow-sm"
            onClick={() => setShowAssignModal(true)}
          >
            🔧 Assign to Team
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Assign Modal */}
  {showAssignModal && (
    <div className="modal d-block bg-dark bg-opacity-50 animate__animated animate__fadeIn">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Assign Maintenance Team</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowAssignModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <select
              className="form-select shadow-sm"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">-- Select team --</option>
              {teams.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-success shadow-sm"
              disabled={!selectedTeam}
              onClick={() => assignToTeam(selectedHazard.id, selectedTeam)}
            >
              ✅ Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
