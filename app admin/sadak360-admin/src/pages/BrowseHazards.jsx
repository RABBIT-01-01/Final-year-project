"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Search, MapPin, Calendar, User, Eye, ChevronDown } from "lucide-react"

function BrowseHazards() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [hazards, setHazards] = useState([]) // From API
  const [filteredHazards, setFilteredHazards] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [dropdownStates, setDropdownStates] = useState({
    type: false,
    severity: false,
    status: false,
  })

  // ✅ Fetch hazard data from API
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          console.log("Fetched hazards:", data)

          // Map API data to UI model
          const formatted = data.map((item) => ({
            id: item._id,
            type: item.issueType,
            description: item.description,
            severity: item.severityLevel,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // e.g. "pending" -> "Pending"
            location: item.location,
            coordinates: `${item.coordinates.latitude}, ${item.coordinates.longitude}`,
            reporter: item.reportedBy.fullname,
            timestamp: item.createdAt,
            image: item.image || "/placeholder.svg?height=200&width=300", // fallback image
            assignedTo: item.maintainance_team, // API doesn’t provide this
            estimatedResolution: null, // API doesn’t provide this
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

  // ✅ Filter hazards when search/filter changes
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
  }, [searchTerm, typeFilter, severityFilter, statusFilter, hazards])

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
    <div key={hazard.id} className="hazard-card">
      <div className="hazard-image">
        <img
            src={
              hazard.image
                ?` http://localhost:4000/api/${hazard.image.replace(/^\//, "")}`
                : "/placeholder.svg"
            }
            alt={hazard.type}
            className="w-full h-full object-cover"
          />

        
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
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span>Assigned to {hazard.assignedTo}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="btn btn-primary flex-1 btn-sm" onClick={() => handleViewDetails(hazard.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </button>
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
