"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Search, MapPin, Calendar, User, Eye } from "lucide-react"

function BrowseHazards() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [hazards, setHazards] = useState([])
  const [filteredHazards, setFilteredHazards] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  // Fetch hazard data
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          const formatted = data.map((item) => ({
            id: item._id,
            type: item.issueType,
            description: item.description,
            severity: item.severityLevel,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            location: item.location,
            coordinates: `${item.coordinates.latitude}, ${item.coordinates.longitude}`,
            reporter: item.reportedBy.fullname,
            timestamp: item.createdAt,
            image: item.image || "/placeholder.svg?height=200&width=300",
            assignedTo: item.maintenance_team || "Unassigned",
          }))
          setHazards(formatted)
          setFilteredHazards(formatted)
        } else {
          console.error("Failed to fetch hazards:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching hazards:", error)
      }
    }
    fetchHazards()
  }, [])

  // Filters
  const searchTerm = searchParams.get("search") || ""
  const typeFilter = searchParams.get("type") || "all"
  const severityFilter = searchParams.get("severity") || "all"
  const statusFilter = searchParams.get("status") || "all"

  const updateSearchParams = (key, value) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (value === "all" || value === "") {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, value)
    }
    setSearchParams(newSearchParams)
  }

  // Apply filtering
  useEffect(() => {
    let filtered = hazards
    if (searchTerm) {
      filtered = filtered.filter(
        (h) =>
          h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (typeFilter !== "all") filtered = filtered.filter((h) => h.type.toLowerCase() === typeFilter)
    if (severityFilter !== "all") filtered = filtered.filter((h) => h.severity.toLowerCase() === severityFilter)
    if (statusFilter !== "all") filtered = filtered.filter((h) => h.status.toLowerCase().replace(" ", "-") === statusFilter)
    setFilteredHazards(filtered)
  }, [searchTerm, typeFilter, severityFilter, statusFilter, hazards])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High": return "badge bg-danger"
      case "Medium": return "badge bg-warning text-dark"
      case "Low": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "badge bg-success"
      case "In Progress": return "badge bg-primary"
      case "Pending": return "badge bg-warning text-dark"
      default: return "badge bg-secondary"
    }
  }

  const groupedByType = useMemo(() => {
    const groups = {}
    filteredHazards.forEach((h) => {
      if (!groups[h.type]) groups[h.type] = []
      groups[h.type].push(h)
    })
    return groups
  }, [filteredHazards])

  const groupedBySeverity = useMemo(() => {
    const groups = {}
    filteredHazards.forEach((h) => {
      if (!groups[h.severity]) groups[h.severity] = []
      groups[h.severity].push(h)
    })
    return groups
  }, [filteredHazards])

  const handleViewDetails = (id) => navigate(`/hazards/${id}`)

  const typeOptions = [
    { value: "all", label: "All Types" },
    ...Array.from(new Set(hazards.map((h) => h.type.toLowerCase()))).map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })),
  ]
  const severityOptions = [
    { value: "all", label: "All Severity" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ]
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ]

  const renderHazardCard = (hazard) => (
    <div key={hazard.id} className="col mb-4">
      <div className="card h-100 shadow-sm">
        {/* <img
          src={ hazard.image
                ?` http://localhost:4000/api/${hazard.image.replace(/^\//, "")}`
                : "/placeholder.svg"}
          className="card-img-top"
          alt={hazard.type}
          style={{ height: "200px", objectFit: "cover" }}
        /> */}
        <img
            src={
              hazard.image
                ?` http://localhost:4000/api/${hazard.image.replace(/^\//, "")}`
                : "/placeholder.svg"
            }
            className="card-img-top"
            alt={hazard.type}
            // className="w-full h-full object-cover"
          />
        <div className="card-body">
          <h5 className="card-title">{hazard.type}</h5>
          <p className="card-text">{hazard.description}</p>
          <p>
            <span className={getSeverityColor(hazard.severity)}>{hazard.severity}</span>{" "}
            <span className={getStatusColor(hazard.status)}>{hazard.status}</span>
          </p>
          <ul className="list-unstyled small mb-2">
            <li><MapPin /> {hazard.location}</li>
            <li><Calendar /> {new Date(hazard.timestamp).toLocaleString()}</li>
            <li><User /> Reported by {hazard.reporter}</li>
            <li><User /> Assigned to {hazard.assignedTo}</li>
          </ul>
          <button className="btn btn-primary w-100" onClick={() => handleViewDetails(hazard.id)}>
            <Eye className="me-2" /> View Details
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container my-4">
      <h2 className="mb-3">Browse Hazards</h2>
      <p className="text-muted">Showing {filteredHazards.length} of {hazards.length} hazards</p>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header"><strong>Filters</strong></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text"><Search /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search hazards..."
                  value={searchTerm}
                  onChange={(e) => updateSearchParams("search", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => updateSearchParams("type", e.target.value)}
              >
                {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={severityFilter}
                onChange={(e) => updateSearchParams("severity", e.target.value)}
              >
                {severityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => updateSearchParams("status", e.target.value)}
              >
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All Hazards</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="by-type" ? "active" : ""}`} onClick={() => setActiveTab("by-type")}>By Anomaly Type</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="by-severity" ? "active" : ""}`} onClick={() => setActiveTab("by-severity")}>By Severity</button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab==="all" && <div className="row row-cols-1 row-cols-md-3 g-3">{filteredHazards.map(renderHazardCard)}</div>}

      {activeTab==="by-type" && Object.entries(groupedByType).map(([type,hazards]) => (
        <div key={type} className="mb-4">
          <h5>{type} <span className="badge bg-secondary">{hazards.length}</span></h5>
          <div className="row row-cols-1 row-cols-md-3 g-3">{hazards.map(renderHazardCard)}</div>
        </div>
      ))}

      {activeTab==="by-severity" && ["High","Medium","Low"].map((severity) => {
        const hazards = groupedBySeverity[severity] || []
        if (!hazards.length) return null
        return (
          <div key={severity} className="mb-4">
            <h5>
              <span className={getSeverityColor(severity)}>{severity} Severity</span>{" "}
              <span className="badge bg-secondary">({hazards.length})</span>
            </h5>
            <div className="row row-cols-1 row-cols-md-3 g-3">{hazards.map(renderHazardCard)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default BrowseHazards
