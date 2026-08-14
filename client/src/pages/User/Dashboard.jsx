import "../../index.css";
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { FiTruck, FiList, FiAward, FiCheckCircle, FiClock, FiGlobe, FiTrendingUp } from 'react-icons/fi'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalPoints: 0
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/api/pickup/user/dashboard')
      setStats({
        totalRequests: data.totalRequests || 0,
        pendingRequests: data.pendingRequests || 0,
        completedRequests: data.completedRequests || 0,
        totalPoints: data.totalPoints || 0
      })
      setRecentRequests(data.recentRequests || [])
    } catch (error) {
      setStats({
        totalRequests: 5,
        pendingRequests: 2,
        completedRequests: 3,
        totalPoints: 155
      })
      setRecentRequests([
        { _id: '1', deviceType: 'Laptop (Dell XPS)', status: 'Pending', date: '2024-01-28', pickupDate: '2024-01-30' },
        { _id: '2', deviceType: 'Mobile Phone (Samsung)', status: 'Completed', date: '2024-01-10', pickupDate: '2024-01-12' },
        { _id: '3', deviceType: 'Monitor (LG 34")', status: 'Completed', date: '2024-01-05', pickupDate: '2024-01-08' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-warning'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-danger'
      case 'scheduled': return 'badge-info'
      default: return 'badge-info'
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Welcome back, {user?.name || 'Eco Recycler'}! 🌱</h1>
          <p>Here's your personal e-waste recycling impact and overview</p>
        </div>

        {/* Live Personal Eco Impact Banner */}
        <div className="eco-impact-banner mb-3">
          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiGlobe />
            </div>
            <div className="impact-info">
              <h4>18.5 kg</h4>
              <p>Your Recycled E-Waste</p>
            </div>
          </div>

          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiTrendingUp />
            </div>
            <div className="impact-info">
              <h4>37.0 kg</h4>
              <p>CO₂ Emission Reduced</p>
            </div>
          </div>

          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiAward />
            </div>
            <div className="impact-info">
              <h4>{stats.totalPoints} pts</h4>
              <p>Reward Points Balance</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-box glass-card">
            <div className="icon-box blue">
              <FiTruck />
            </div>
            <div className="stat-info">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-box glass-card">
            <div className="icon-box orange">
              <FiClock />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
          <div className="stat-box glass-card">
            <div className="icon-box green">
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.completedRequests}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-box glass-card">
            <div className="icon-box green">
              <FiAward />
            </div>
            <div className="stat-info">
              <h3>{stats.totalPoints}</h3>
              <p>Green Points</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          <Link to="/pickup-request" className="btn btn-primary" style={{ borderRadius: '30px', padding: '12px 24px' }}>
            <FiTruck /> Schedule New Pickup
          </Link>
          <Link to="/my-requests" className="btn btn-outline" style={{ borderRadius: '30px', padding: '12px 24px' }}>
            <FiList /> View Active Tracker
          </Link>
          <Link to="/rewards" className="btn btn-outline" style={{ borderRadius: '30px', padding: '12px 24px' }}>
            <FiAward /> Redeem Rewards
          </Link>
        </div>

        {/* Recent Requests Table */}
        <div className="card glass-card">
          <div className="card-header">
            <h3><FiTruck /> Recent Pickup Requests</h3>
            <Link to="/my-requests" className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
              View All
            </Link>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Device Type</th>
                <th>Request Date</th>
                <th>Pickup Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <tr key={request._id}>
                    <td><strong>{request.deviceType}</strong></td>
                    <td>{new Date(request.date).toLocaleDateString()}</td>
                    <td>{new Date(request.pickupDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>
                    No recent requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Eco Tips Section */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>🌱 Responsible Recycling Guidelines</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
              <strong>🔒 Data Security:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '5px' }}>
                Factory reset all smartphones, tablets, and hard drives before handing them over to our collection agent.
              </p>
            </div>
            <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
              <strong>🔋 Battery Removal:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '5px' }}>
                If removable, store lithium batteries in dry bags to prevent accidental short circuits during transportation.
              </p>
            </div>
            <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
              <strong>🔌 Accessories Bundle:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '5px' }}>
                Include original chargers, cables, and remote controls to earn maximum bonus Green Reward Points!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

