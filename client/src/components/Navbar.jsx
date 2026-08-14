import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth() || {};

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        ♻️ <span>E-Waste Portal</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/schedule-pickup">Schedule Pickup</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            <Link to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"}>Dashboard</Link>
            <button className="login-btn" onClick={logout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;