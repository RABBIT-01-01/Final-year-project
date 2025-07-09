import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "./components/AdminLayout"
import Dashboard from "./pages/Dashboard"
import MapView from "./pages/MapView"
import Analytics from "./pages/Analytics"
import BrowseHazards from "./pages/BrowseHazards"

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<MapView />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="hazards" element={<BrowseHazards />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
