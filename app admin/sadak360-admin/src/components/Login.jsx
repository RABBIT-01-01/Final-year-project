"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import { Loader2, Eye, EyeOff, Shield } from "lucide-react";
import "animate.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("❌ Invalid email or password.");
      }
    } catch (err) {
      setError("⚠️ An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@example.com");
    setPassword("admin123");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #E0F7FA, #E3F2FD)",
      }}
    >
      <div
        className="card shadow-lg rounded-4 border border-light animate__animated animate__fadeInDown"
        style={{
          maxWidth: "420px",
          width: "100%",
          animationDuration: "0.8s",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div className="card-header text-center border-0 py-4" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="mb-3 animate__animated animate__zoomIn">
            <div
              className="d-inline-flex p-3 rounded-circle shadow"
              style={{ backgroundColor: "#0D6EFD" }}
            >
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h3 className="card-title fw-bold mb-1 animate__animated animate__fadeIn" style={{ color: "#212529" }}>
            Welcome Back
          </h3>
          <p
            className="card-text text-muted mb-0 animate__animated animate__fadeIn animate__delay-1s"
            style={{ color: "#6C757D" }}
          >
            Sign in to access your admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {/* Error alert */}
            {error && (
              <div
                className="alert d-flex align-items-center animate__animated animate__shakeX"
                role="alert"
                style={{
                  backgroundColor: "#F8D7DA",
                  color: "#842029",
                  borderColor: "#F5C2C7",
                }}
              >
                <div>{error}</div>
              </div>
            )}

            {/* Demo login */}
            <div
              className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center animate__animated animate__pulse animate__infinite"
              style={{
                backgroundColor: "#CAF0F8",
                borderColor: "#90E0EF",
              }}
            >
              <div>
                <p className="mb-0 fw-semibold" style={{ color: "#0077B6" }}>
                  Demo Login
                </p>
                <small style={{ color: "#0096C7" }}>admin@example.com / admin123</small>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={fillDemoCredentials}
                disabled={isLoading}
              >
                Fill
              </button>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#212529" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control border-primary shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={{
                  transition: "0.3s",
                  boxShadow: "0 0 0 0 rgba(13,110,253,0)",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px rgba(13,110,253,0.5)")}
                onBlur={(e) => (e.target.style.boxShadow = "0 0 0 0 rgba(13,110,253,0)")}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#212529" }}>
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control border-primary shadow-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    transition: "0.3s",
                    boxShadow: "0 0 0 0 rgba(13,110,253,0)",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 8px rgba(13,110,253,0.5)")}
                  onBlur={(e) => (e.target.style.boxShadow = "0 0 0 0 rgba(13,110,253,0)")}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0 pb-4 pt-0">
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold d-flex justify-content-center align-items-center animate__animated animate__pulse animate__fast"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="me-2 spinner-border spinner-border-sm" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
