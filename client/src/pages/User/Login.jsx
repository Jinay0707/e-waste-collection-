import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      login({ ...user, token });
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'user') {
      setEmail("user@example.com");
      setPassword("password123");
    } else {
      setEmail("admin@example.com");
      setPassword("admin123");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon-badge">
            ♻️
          </div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to schedule e-waste pickups & track eco rewards
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : (
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div>
            <p style={{ fontWeight: 600, color: "#334155" }}>⚡ Auto Fill Demo</p>
            <p>Click for instant testing</p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button type="button" className="demo-fill-btn" onClick={() => handleDemoFill('user')}>User</button>
            <button type="button" className="demo-fill-btn" onClick={() => handleDemoFill('admin')}>Admin</button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
          <p style={{ marginTop: "10px", fontSize: "0.82rem" }}>
            Are you an admin? <Link to="/admin/login" style={{ color: "#ef4444" }}>Admin Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;