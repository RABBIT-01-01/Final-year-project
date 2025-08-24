import { AlertTriangle, Users, MapPin, TrendingUp } from "lucide-react"






import { useEffect, useState } from "react";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [hazardStats, setHazardStats] = useState([]);

   const stats = [
    {
      title: "Total Reports",
      value: "1,234",
      description: "+12% from last month",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Active Users",
      value: "856",
      description: "+5% from last month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Resolved Issues",
      value: "892",
      description: "+18% from last month",
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: "Response Rate",
      value: "94.2%",
      description: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/requests/");
        const data = await response.json();

        // Sort reports by createdAt (newest first)
        const sortedReports = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Take the 5 most recent reports
        setReports(sortedReports.slice(0, 5));

        // Calculate hazard distribution
        const typeCounts = {};
        data.forEach((report) => {
          const type = report.issueType;
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const total = data.length;
        const stats = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
          percentage: ((count / total) * 100).toFixed(1), // 1 decimal point
        }));

        setHazardStats(stats);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Reports */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Reports</h3>
            <p className="text-sm text-gray-600">Latest hazard reports from users</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={report._id || index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{report.issueType}</p>
                    <p className="text-sm text-gray-600">{report.location}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.severityLevel === "High"
                          ? "bg-red-100 text-red-800"
                          : report.severityLevel === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.severityLevel}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hazard Distribution */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hazard Distribution</h3>
            <p className="text-sm text-gray-600">Types of hazards reported</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {hazardStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <span className="text-xs text-gray-600">
                      ({item.percentage}%)
                    </span>
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
