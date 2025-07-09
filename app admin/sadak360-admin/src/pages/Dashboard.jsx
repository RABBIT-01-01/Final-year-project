import { AlertTriangle, Users, MapPin, TrendingUp } from "lucide-react"

function Dashboard() {
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
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Reports</h3>
            <p className="text-sm text-gray-600">Latest hazard reports from users</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[
                { type: "Pothole", location: "MG Road", severity: "High", time: "2 hours ago" },
                { type: "Debris", location: "Ring Road", severity: "Medium", time: "4 hours ago" },
                { type: "Water Logging", location: "City Center", severity: "High", time: "6 hours ago" },
                { type: "Road Crack", location: "Highway 1", severity: "Low", time: "8 hours ago" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-gray-600">{report.location}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.severity === "High"
                          ? "bg-red-100 text-red-800"
                          : report.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.severity}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{report.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hazard Distribution</h3>
            <p className="text-sm text-gray-600">Types of hazards reported</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[
                { type: "Potholes", count: 456, percentage: 37 },
                { type: "Debris", count: 234, percentage: 19 },
                { type: "Water Logging", count: 189, percentage: 15 },
                { type: "Road Cracks", count: 167, percentage: 14 },
                { type: "Others", count: 188, percentage: 15 },
              ].map((item, index) => (
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
                    <span className="text-xs text-gray-600">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
