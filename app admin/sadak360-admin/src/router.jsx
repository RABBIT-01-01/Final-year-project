import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "./components/AdminLayout"
import Dashboard from "./pages/Dashboard"
import MapView from "./pages/MapView"
import Analytics from "./pages/Analytics"
import BrowseHazards from "./pages/BrowseHazards"
import Maintanance_report from "./pages/Maintanance_report"
import Login from "./components/Login"
import { AuthProvider } from "./components/auth-provider"
import ProtectedRoute from "./components/ProtectedRoute";

function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
             </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<MapView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="hazards" element={<BrowseHazards />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="maintanance_report" element={<Maintanance_report />} />

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default AppRouter
