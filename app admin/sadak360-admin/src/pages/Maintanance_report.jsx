"use client";

import { useState } from "react";

export default function Maintanance_report() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    maintenance_team: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const maintenance_teams = [
    "Electricity",
    "Pothole",
    "Flood",
    "Traffic jam",
    "Emergency",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        maintenance_team: formData.maintenance_team,
        logUser: "maintenance",
      }),
      });
      console.log("Response status:", response.status)
      console.log("Response headers:", formData)

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Registered successfully. Please login.");
        setFormData({
          fullname: "",
          email: "",
          phone: "",
          password: "",
          maintenance_team: "",
        });
      } else {
        setError(data.message || "❌ Registration failed.");
      }
    } catch (error) {
      setError("⚠️ An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <style>{`
        .form-container {
          animation: slideInUp 0.6s ease-out;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }
        .password-toggle:hover {
          color: #0d6efd;
        }
        .password-input-wrapper {
          position: relative;
        }
        .password-input-wrapper .form-control {
          padding-right: 40px;
        }
        .submitting {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow form-container">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0 text-center">
                  Registration Form
                </h3>
              </div>
              <div className="card-body">
                {/* Error message */}
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {/* Success message */}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your phone number"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your password"
                        minLength={6}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div className="form-text">
                      Password must be at least 6 characters long.
                    </div>
                  </div>

                  {/* Maintenance Team Dropdown */}
                  <div className="mb-3">
                    <label
                      htmlFor="maintenance_team"
                      className="form-label"
                    >
                      Maintenance Team <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="maintenance_team"
                      name="maintenance_team"
                      value={formData.maintenance_team}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select a maintenance team</option>
                      {maintenance_teams.map((team, index) => (
                        <option key={index} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg ${
                        isSubmitting ? "submitting" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registering...
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
