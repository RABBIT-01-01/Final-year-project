import { Outlet } from "react-router-dom"
import { BarChart3, Map, Home, Filter } from "lucide-react"
import SimpleSidebar from "./SimpleSidebar"

const navigation = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Map View",
    icon: Map,
    href: "/map",
  },
  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   href: "/analytics",
  // },
  {
    title: "Browse Hazards",
    icon: Filter,
    href: "/hazards",
  },
]

function AdminLayout() {
  return (
    <SimpleSidebar navigation={navigation}>
      <Outlet />
    </SimpleSidebar>
  )
}

export default AdminLayout
