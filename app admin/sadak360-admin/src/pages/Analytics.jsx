"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Users, AlertTriangle, MapPin, Clock, ChevronDown } from "lucide-react"

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const periodOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "1year", label: "Last year" },
  ]

  const metrics = [
    {
      title: "Total Reports This Month",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: AlertTriangle,
    },
    {
      title: "Average Response Time",
      value: "2.4 hrs",
      change: "-8.2%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Active Reporters",
      value: "856",
      change: "+5.1%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Resolution Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: MapPin,
    },
  ]

  const reportsByType = [
    { type: "Potholes", count: 456, percentage: 37, color: "#ef4444" },
    { type: "Debris", count: 234, percentage: 19, color: "#f97316" },
    { type: "Water Logging", count: 189, percentage: 15, color: "#eab308" },
    { type: "Road Cracks", count: 167, percentage: 14, color: "#22c55e" },
    { type: "Streetlights", count: 123, percentage: 10, color: "#3b82f6" },
    { type: "Others", count: 65, percentage: 5, color: "#8b5cf6" },
  ]

  const monthlyData = [
    { month: "Jan", reports: 890, resolved: 845 },
    { month: "Feb", reports: 1020, resolved: 980 },
    { month: "Mar", reports: 1150, resolved: 1100 },
    { month: "Apr", reports: 980, resolved: 920 },
    { month: "May", reports: 1200, resolved: 1150 },
    { month: "Jun", reports: 1234, resolved: 1180 },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Time Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {periodOptions.find((option) => option.value === selectedPeriod)?.label}
            <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
              <div className="p-1">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                    onClick={() => {
                      setSelectedPeriod(option.value)
                      setIsDropdownOpen(false)
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium">{metric.title}</h3>
              <metric.icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
                <span className="ml-1">from last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Reports by Type */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Reports by Type</h3>
            <p className="text-sm text-gray-600">Distribution of hazard types reported</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {reportsByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                    <span className="text-xs text-gray-500 w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Monthly Trends</h3>
            <p className="text-sm text-gray-600">Reports received vs resolved over time</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-8">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex gap-1">
                      <div className="flex-1 bg-blue-200 rounded h-6 flex items-center justify-center relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded"
                          style={{ width: `${(data.reports / 1400) * 100}%` }}
                        />
                        <span className="text-xs font-medium text-white relative z-10">{data.reports}</span>
                      </div>
                      <div className="flex-1 bg-green-200 rounded h-6 flex items-center justify-center relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500 rounded"
                          style={{ width: `${(data.resolved / 1400) * 100}%` }}
                        />
                        <span className="text-xs font-medium text-white relative z-10">{data.resolved}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{Math.round((data.resolved / data.reports) * 100)}%</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Reported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Peak Reporting Hours</h3>
            <p className="text-sm text-gray-600">When users report most hazards</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-2">
              {[
                { time: "8:00 AM - 10:00 AM", reports: 234, percentage: 28 },
                { time: "6:00 PM - 8:00 PM", reports: 189, percentage: 23 },
                { time: "12:00 PM - 2:00 PM", reports: 156, percentage: 19 },
                { time: "10:00 AM - 12:00 PM", reports: 123, percentage: 15 },
                { time: "Other hours", reports: 132, percentage: 15 },
              ].map((slot, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{slot.time}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${slot.percentage}%` }} />
                    </div>
                    <span className="w-8 text-right">{slot.reports}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Top Locations</h3>
            <p className="text-sm text-gray-600">Areas with most reports</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-3">
              {[
                { location: "MG Road", reports: 89 },
                { location: "Ring Road", reports: 67 },
                { location: "City Center", reports: 54 },
                { location: "Highway 1", reports: 43 },
                { location: "Park Avenue", reports: 32 },
              ].map((area, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{area.location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-orange-500 rounded-full"
                        style={{ width: `${(area.reports / 89) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{area.reports}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Response Performance</h3>
            <p className="text-sm text-gray-600">Team response metrics</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-gray-500">Resolution Rate</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg. Response Time</span>
                  <span className="font-medium">2.4 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Resolution Time</span>
                  <span className="font-medium">18.6 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">4.7/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
