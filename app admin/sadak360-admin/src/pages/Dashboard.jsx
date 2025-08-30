"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Users, MapPin, TrendingUp } from "lucide-react";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [hazardStats, setHazardStats] = useState([]);

  const stats = [
    {
      title: "Total Reports",
      value: "1,234",
      description: "+12% from last month",
      icon: AlertTriangle,
      color: "text-danger",
    },
    {
      title: "Active Users",
      value: "856",
      description: "+5% from last month",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Resolved Issues",
      value: "892",
      description: "+18% from last month",
      icon: MapPin,
      color: "text-success",
    },
    {
      title: "Response Rate",
      value: "94.2%",
      description: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-warning",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/", {
          credentials: "include",
        });
        const data = await response.json();

        const sortedReports = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReports(sortedReports.slice(0, 5));

        const typeCounts = {};
        data.forEach((report) => {
          const type = report.issueType;
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const total = data.length;
        const hazardStats = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
          percentage: ((count / total) * 100).toFixed(1),
        }));

        setHazardStats(hazardStats);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", background: "#E9ECEF" }}>
      {/* Stats cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex justify-content-between align-items-center pb-2">
                <h6 className="card-title mb-0">{stat.title}</h6>
                <stat.icon className={`fs-4 ${stat.color}`} />
              </div>
              <div className="card-body pt-0">
                <h3 className="card-text fw-bold">{stat.value}</h3>
                <p className="text-muted small">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports & Hazard Distribution */}
      <div className="row g-4">
        {/* Recent Reports */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5 className="mb-1">Recent Reports</h5>
              <small className="text-muted">Latest hazard reports from users</small>
            </div>
            <div className="card-body">
              {reports.map((report, index) => (
                <div
                  key={report._id || index}
                  className="d-flex justify-content-between align-items-start p-3 mb-3 rounded border"
                  style={{ transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e9ecef"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <div>
                    <p className="mb-1 fw-semibold">{report.issueType}</p>
                    <p className="mb-0 text-muted">{report.location}</p>
                  </div>
                  <div className="text-end">
                    <span
                      className={`badge fw-semibold ${
                        report.severityLevel === "High"
                          ? "bg-danger"
                          : report.severityLevel === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {report.severityLevel}
                    </span>
                    <p className="text-muted small mt-1 mb-0">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hazard Distribution */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5 className="mb-1">Hazard Distribution</h5>
              <small className="text-muted">Types of hazards reported</small>
            </div>
            <div className="card-body">
              {hazardStats.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      }}
                    />
                    <span>{item.type}</span>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="fw-semibold">{item.count}</span>
                    <span className="text-muted small">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
