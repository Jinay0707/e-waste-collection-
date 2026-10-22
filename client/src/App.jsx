import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Contact from "./pages/User/Contact";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import ForgotPassword from "./pages/User/ForgotPassword";
import Dashboard from "./pages/User/Dashboard";
import PickupRequest from "./pages/User/PickupRequest";
import SchedulePickup from "./pages/User/SchedulePickup";
import MyRequests from "./pages/User/MyRequests";
import Rewards from "./pages/User/Rewards";
import Profile from "./pages/User/Profile";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageRequests from "./pages/Admin/ManageRequests";
import ManageUsers from "./pages/Admin/ManageUsers";
import PickupStatus from "./pages/Admin/PickupStatus";
import Reports from "./pages/Admin/Reports";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/schedule-pickup" element={<SchedulePickup />} />

              {/* User Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pickup-request" element={<PickupRequest />} />
              <Route path="/request-pickup" element={<PickupRequest />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<ManageRequests />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/pickup-status" element={<PickupStatus />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;