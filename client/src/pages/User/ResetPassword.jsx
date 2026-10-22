import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import api from "../../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.put(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired reset link. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon-badge">
            🔑
          </div>
          <h1>Create New Password</h1>
          <p className="auth-subtitle">
            Enter your new secure password below
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "2.8rem", color: "#10b981", marginBottom: "12px" }}>
              <FiCheckCircle style={{ margin: "0 auto" }} />
            </div>
            <h3 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "8px" }}>
              Password Reset Successful!
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "20px" }}>
              Your password has been updated. Redirecting you to login...
            </p>
            <Link to="/login" className="auth-btn" style={{ textDecoration: "none" }}>
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="New Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Updating..." : (
                <>
                  Update Password <FiArrowRight />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Back to <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
