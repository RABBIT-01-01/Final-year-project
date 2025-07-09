"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Search, MapPin, Calendar, User, Eye, ChevronDown } from "lucide-react"

const hazards = [
  {
    id: "HAZ-001",
    type: "Pothole",
    description: "Large pothole on MG Road causing vehicle damage and traffic slowdown",
    severity: "High",
    status: "Pending",
    location: "MG Road, Sector 14, Near Metro Station",
    coordinates: "28.6139, 77.2090",
    reporter: "John Doe",
    timestamp: "2024-01-15T10:30:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: "Team Alpha",
    estimatedResolution: "2024-01-17T10:00:00Z",
  },
  {
    id: "HAZ-002",
    type: "Debris",
    description: "Construction debris blocking traffic lane, creating safety hazard",
    severity: "Medium",
    status: "In Progress",
    location: "Ring Road, Phase 2, Construction Zone",
    coordinates: "28.6129, 77.2295",
    reporter: "Jane Smith",
    timestamp: "2024-01-15T09:15:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: "Team Beta",
    estimatedResolution: "2024-01-16T15:00:00Z",
  },
  {
    id: "HAZ-003",
    type: "Water Logging",
    description: "Severe water logging after heavy rain, road impassable",
    severity: "High",
    status: "Resolved",
    location: "City Center Mall, Main Entrance",
    coordinates: "28.6169, 77.2295",
    reporter: "Mike Johnson",
    timestamp: "2024-01-15T08:45:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: "Team Gamma",
    resolvedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "HAZ-004",
    type: "Road Crack",
    description: "Minor crack developing in road surface, needs monitoring",
    severity: "Low",
    status: "Pending",
    location: "Highway 1, KM 45, Service Lane",
    coordinates: "28.6189, 77.2190",
    reporter: "Sarah Wilson",
    timestamp: "2024-01-15T07:20:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: null,
    estimatedResolution: null,
  },
  {
    id: "HAZ-005",
    type: "Broken Streetlight",
    description: "Streetlight not working, creating safety hazard during night",
    severity: "Medium",
    status: "In Progress",
    location: "Park Avenue, Block C, Residential Area",
    coordinates: "28.6209, 77.2150",
    reporter: "David Brown",
    timestamp: "2024-01-14T22:10:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: "Team Delta",
    estimatedResolution: "2024-01-16T18:00:00Z",
  },
  {
    id: "HAZ-006",
    type: "Manhole Cover Missing",
    description: "Open manhole without cover, extremely dangerous for vehicles",
    severity: "High",
    status: "Pending",
    location: "Industrial Area, Sector 8, Main Road",
    coordinates: "28.6099, 77.2250",
    reporter: "Lisa Anderson",
    timestamp: "2024-01-14T16:45:00Z",
    image: "/placeholder.svg?height=200&width=300",
    assignedTo: "Team Alpha",
    estimatedResolution: "2024-01-16T12:00:00Z",
  },
]

function BrowseHazards() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filteredHazards, setFilteredHazards] = useState(hazards)
  const [activeTab, setActiveTab] = useState("all")
  const [dropdownStates, setDropdownStates] = useState({
    type: false,
    severity: false,
    status: false,
  })

  // Get URL parameters
  const searchTerm = searchParams.get("search") || ""
  const typeFilter = searchParams.get("type") || "all"
  const severityFilter = searchParams.get("severity") || "all"
  const statusFilter = searchParams.get("status") || "all"

  // Update URL parameters
  const updateSearchParams = (key, value) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (value === "all" || value === "") {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, value)
    }
    setSearchParams(newSearchParams)
  }

  const toggleDropdown = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const closeDropdown = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: false,
    }))
  }

  useEffect(() => {
    let filtered = hazards

    if (searchTerm) {
      filtered = filtered.filter(
        (hazard) =>
          hazard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hazard.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hazard.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((hazard) => hazard.type.toLowerCase() === typeFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((hazard) => hazard.severity.toLowerCase() === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((hazard) => hazard.status.toLowerCase().replace(" ", "-") === statusFilter)
    }

    setFilteredHazards(filtered)
  }, [searchTerm, typeFilter, severityFilter, statusFilter])

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "badge badge-success"
      case "In Progress":
        return "badge badge-primary"
      case "Pending":
        return "badge badge-warning"
      default:
        return "badge badge-secondary"
    }
  }

  const groupedByType = useMemo(() => {
    const groups = {}
    filteredHazards.forEach((hazard) => {
      if (!groups[hazard.type]) {
        groups[hazard.type] = []
      }
      groups[hazard.type].push(hazard)
    })
    return groups
  }, [filteredHazards])

  const groupedBySeverity = useMemo(() => {
    const groups = {}
    filteredHazards.forEach((hazard) => {
      if (!groups[hazard.severity]) {
        groups[hazard.severity] = []
      }
      groups[hazard.severity].push(hazard)
    })
    return groups
  }, [filteredHazards])

  const handleViewDetails = (hazardId) => {
    navigate(`/hazards/${hazardId}`)
  }

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "pothole", label: "Pothole" },
    { value: "debris", label: "Debris" },
    { value: "water logging", label: "Water Logging" },
    { value: "road crack", label: "Road Crack" },
    { value: "broken streetlight", label: "Broken Streetlight" },
    { value: "manhole cover missing", label: "Manhole Cover Missing" },
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
    <div key={hazard.id} className="hazard-card">
      <div className="hazard-image">
        <img src={hazard.image || "/placeholder.svg"} alt={hazard.type} className="w-full h-full object-cover" />
        <div className="hazard-badges">
          <span className={getSeverityColor(hazard.severity)}>{hazard.severity}</span>
          <span className={getStatusColor(hazard.status)}>{hazard.status}</span>
        </div>
      </div>
      <div className="card-header">
        <div className="flex justify-between items-start">
          <h3 className="card-title">{hazard.type}</h3>
          <span className="text-sm text-gray-500">{hazard.id}</span>
        </div>
        <p className="card-description line-clamp-2">{hazard.description}</p>
      </div>
      <div className="card-content space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="truncate">{hazard.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(hazard.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span>Reported by {hazard.reporter}</span>
        </div>
        {hazard.assignedTo && (
          <div className="text-sm">
            <span className="font-medium">Assigned to:</span> {hazard.assignedTo}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button className="btn btn-primary flex-1 btn-sm" onClick={() => handleViewDetails(hazard.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </button>
          <button className="btn btn-secondary btn-sm">Edit</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="browse-hazards-container">
      <div className="browse-hazards-header">
        <h2 className="text-2xl font-bold">Browse Hazards</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredHazards.length} of {hazards.length} hazards
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="card-header">
          <h3 className="card-title">Filters</h3>
        </div>
        <div className="card-content">
          <div className="filters-grid">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search hazards..."
                className="input search-input"
                value={searchTerm}
                onChange={(e) => updateSearchParams("search", e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="filter-dropdown">
              <button type="button" className="select-trigger" onClick={() => toggleDropdown("type")}>
                {typeOptions.find((option) => option.value === typeFilter)?.label || "Filter by type"}
                <ChevronDown className={`dropdown-icon ${dropdownStates.type ? "rotate-180" : ""}`} />
              </button>
              {dropdownStates.type && (
                <div className="select-content">
                  <div className="p-1">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="select-item"
                        onClick={() => {
                          updateSearchParams("type", option.value)
                          closeDropdown("type")
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Severity Filter */}
            <div className="filter-dropdown">
              <button type="button" className="select-trigger" onClick={() => toggleDropdown("severity")}>
                {severityOptions.find((option) => option.value === severityFilter)?.label || "Filter by severity"}
                <ChevronDown className={`dropdown-icon ${dropdownStates.severity ? "rotate-180" : ""}`} />
              </button>
              {dropdownStates.severity && (
                <div className="select-content">
                  <div className="p-1">
                    {severityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="select-item"
                        onClick={() => {
                          updateSearchParams("severity", option.value)
                          closeDropdown("severity")
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="filter-dropdown">
              <button type="button" className="select-trigger" onClick={() => toggleDropdown("status")}>
                {statusOptions.find((option) => option.value === statusFilter)?.label || "Filter by status"}
                <ChevronDown className={`dropdown-icon ${dropdownStates.status ? "rotate-180" : ""}`} />
              </button>
              {dropdownStates.status && (
                <div className="select-content">
                  <div className="p-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="select-item"
                        onClick={() => {
                          updateSearchParams("status", option.value)
                          closeDropdown("status")
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed View */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button
            type="button"
            className={`tabs-trigger ${activeTab === "all" ? "tabs-trigger-active" : "tabs-trigger-inactive"}`}
            onClick={() => setActiveTab("all")}
          >
            All Hazards
          </button>
          <button
            type="button"
            className={`tabs-trigger ${activeTab === "by-type" ? "tabs-trigger-active" : "tabs-trigger-inactive"}`}
            onClick={() => setActiveTab("by-type")}
          >
            By Anomaly Type
          </button>
          <button
            type="button"
            className={`tabs-trigger ${activeTab === "by-severity" ? "tabs-trigger-active" : "tabs-trigger-inactive"}`}
            onClick={() => setActiveTab("by-severity")}
          >
            By Severity
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "all" && <div className="hazards-grid">{filteredHazards.map(renderHazardCard)}</div>}

          {activeTab === "by-type" && (
            <div className="grouped-content">
              {Object.entries(groupedByType).map(([type, typeHazards]) => (
                <div key={type} className="group-section">
                  <h3 className="group-title">
                    {type}
                    <span className="group-count">{typeHazards.length}</span>
                  </h3>
                  <div className="hazards-grid">{typeHazards.map(renderHazardCard)}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "by-severity" && (
            <div className="grouped-content">
              {["High", "Medium", "Low"].map((severity) => {
                const severityHazards = groupedBySeverity[severity] || []
                if (severityHazards.length === 0) return null

                return (
                  <div key={severity} className="group-section">
                    <h3 className="group-title">
                      <span className={getSeverityColor(severity)}>{severity} Severity</span>
                      <span className="group-count">({severityHazards.length})</span>
                    </h3>
                    <div className="hazards-grid">{severityHazards.map(renderHazardCard)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseHazards
