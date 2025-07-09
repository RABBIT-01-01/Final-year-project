"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, AlertTriangle } from 'lucide-react'

function SimpleSidebar({ navigation, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
              {/* <AlertTriangle className="w-4 h-4" /> */}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">Sadak360</span>
              <span className="text-xs text-gray-500">Admin Dashboard</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Navigation</div>
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-6">
          <button 
            onClick={() => setIsOpen(true)} 
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {navigation.find((item) => location.pathname === item.href)?.title || "Dashboard"}
          </h1>
          <div className="w-6 lg:hidden"></div> {/* Spacer for mobile */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

export default SimpleSidebar
