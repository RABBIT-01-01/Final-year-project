"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import { useAuth } from "./auth-provider"
import { User, LogOut } from "lucide-react"
import "animate.css"

// ✅ import your logo
import img from "../assets/logo.png"

import { useEffect } from "react";
import { Tooltip } from "bootstrap";



function SimpleSidebar({ navigation, children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }, [collapsed]);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div
        className={`shadow-lg d-flex flex-column animate__animated ${
          isOpen ? "animate__slideInLeft" : "animate__slideOutLeft d-none"
        }`}
        style={{
          width: collapsed ? "90px" : "280px",
          background: "linear-gradient(180deg, #1f2937, #111827)",
          color: "#f3f4f6",
          zIndex: 1050,
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom border-secondary px-3 py-3">
  <div className="d-flex align-items-center gap-2">
    <img
      src={img}
      alt="Sadak360 Logo"
      style={{
        width: collapsed ? "40px" : "45px",
        height: "45px",
        objectFit: "contain",
      }}
      className="rounded shadow-sm bg-white p-1"
    />

    {!collapsed && (
      <div className="d-flex flex-column justify-content-center">
        <div className="fw-bold text-light fs-5" style={{ marginTop: "8px" }}>
          Sadak360
        </div>
        <div className="small text-muted">Admin Dashboard</div>
      </div>
    )}
  </div>

  {!collapsed && (
    <button
      onClick={() => setIsOpen(false)}
      className="btn btn-sm btn-outline-light d-lg-none"
    >
      <X size={18} />
    </button>
  )}
</div>


        {/* Navigation */}
        <nav className="flex-grow-1 overflow-auto p-2">
          <div
            className={`text-uppercase small mb-2 ${
              collapsed ? "text-center text-secondary" : "text-muted"
            }`}
          >
            Navigation
          </div>

          {navigation.map((item) => (
            <div key={item.href} className="mb-1">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none fw-medium sidebar-nav-link ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-light"
                  } ${collapsed ? "justify-content-center" : ""}`
                }
                // ✅ Tooltip only when collapsed
                data-bs-toggle={collapsed ? "tooltip" : ""}
                data-bs-placement="right"
                title={collapsed ? item.title : ""}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>

            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-top border-secondary p-2 text-center">
          <button
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronDown
              className={`transition ${collapsed ? "rotate-180" : ""}`}
              size={16}
            />
            {!collapsed && "Collapse Sidebar"}
          </button>
        </div>
      </div>

            {/* Main content */}
          <div className="flex-grow-1 d-flex flex-column">
        {/* Top bar */}
        <header
          className="d-flex align-items-center justify-content-between border-bottom px-4 py-2 shadow-sm"
          style={{
            backgroundColor: "#F8F9FA", // light grey matching sidebar
          }}
        >
          <h1 className="h5 mb-0 fw-semibold text-dark">
            {navigation.find((item) => location.pathname === item.href)?.title ||
              "Dashboard"}
          </h1>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <User size={20} />
              <span className="fw-semibold text-dark">{user?.name}</span>
            </div>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-grow-1 overflow-auto p-4 animate__animated animate__fadeIn"
          style={{
            backgroundColor: "#E9ECEF", // slightly darker grey for content area
          }}
        >
          {children}
        </main>
      </div>


      {/* Floating toggle button */}
      <button
        className="btn btn-primary position-fixed bottom-0 start-0 m-3 shadow rounded-circle floating-toggle"
        style={{ zIndex: 2000, width: "55px", height: "55px" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  )
}

export default SimpleSidebar
