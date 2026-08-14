import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiUsers, FiTruck, FiCheckCircle, FiAlertCircle, FiClock, FiBarChart2, FiTrendingUp } from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingPickups: 0,
    completedPickups: 0,
    totalWeight: 0,
    activeUsers: 0
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const { data } = await api.get('/api/admin/dashboard')
      setStats({
        totalUsers: data.totalUsers || 0,
        totalRequests: data.totalRequests || 0,
        pendingPickups: data.pendingPickups || 0,
        completedPickups: data.completedPickups || 0,
        totalWeight: data.totalWeight || 0,
        activeUsers: data.activeUsers || 0
      })
      setRecentRequests(data.recentRequests || [])
      setRecentUsers(data.recentUsers || [])
    } catch (error) {
      console.error('Admin dashboard error:', error)
      // Sample data for demo
      setStats({
        totalUsers: 245,
        totalRequests: 532,
        pendingPickups: 18,
        completedPickups: 498,
        totalWeight: 1250,
        activeUsers: 180
      })
      setRecentRequests([
        { _id: '1', userName: 'Rahul Sharma', deviceType: 'Laptop', status: 'Pending', date: '2024-01-28' },
        { _id: '2', userName: 'Priya Singh', deviceType: 'Mobile Phone', status: 'Scheduled', date: '2024-01-28' },
        { _id: '3', userName: 'Amit Patel', deviceType: 'Monitor', status: 'Pending', date: '2024-01-27' },
        { _id: '4', userName: 'Sneha Gupta', deviceType: 'Tablet', status: 'Completed', date: '2024-01-27' },
        { _id: '5', userName: 'Vikram Rao', deviceType: 'Desktop', status: 'Scheduled', date: '2024-01-26' },
      ])
      setRecentUsers([
        { _id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', city: 'Mumbai', date: '2024-01-25' },
        { _id: '2', name: 'Priya Singh', email: 'priya@email.com', city: 'Delhi', date: '2024-01-24' },
        { _id: '3', name: 'Amit Patel', email: 'amit@email.com', city: 'Bangalore', date: '2024-01-23' },
        { _id: '4', name: 'Sneha Gupta', email: 'sneha@email.com', city: 'Pune', date: '2024-01-22' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of the e-waste collection platform</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="icon-box blue">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="icon-box orange">
              <FiTruck />
            </div>
            <div className="stat-info">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="icon-box green">
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.completedPickups}</h3>
              <p>Completed Pickups</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="icon-box red">
              <FiAlertCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingPickups}</h3>
              <p>Pending Pickups</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="icon-box green">
              <FiBarChart2 />
            </div>
            <div className="stat-info">
              <h3>{stats.totalWeight} kg</h3>
              <p>Total E-Waste Collected</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="icon-box blue">
              <FiTrendingUp />
            </div>
            <div className="stat-info">
              <h3>{stats.activeUsers}</h3>
              <p>Active Users (30 days)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          <Link to="/admin/requests" className="btn btn-primary">
            <FiTruck /> Manage Requests
          </Link>
          <Link to="/admin/users" className="btn btn-outline">
            <FiUsers /> Manage Users
          </Link>
          <Link to="/admin/pickup-status" className="btn btn-outline">
            <FiClock /> Pickup Status
          </Link>
          <Link to="/admin/reports" className="btn btn-outline">
            <FiBarChart2 /> View Reports
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
          {/* Recent Requests */}
          <Card title="Recent Pickup Requests" headerAction={
            <Link to="/admin/requests" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>View All →</Link>
          }>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Device</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.userName}</td>
                    <td>{req.deviceType}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'Pending' ? 'badge-warning' :
                        req.status === 'Completed' ? 'badge-success' :
                        req.status === 'Scheduled' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{new Date(req.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Recent Users */}
          <Card title="Recent Registrations" headerAction={
            <Link to="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>View All →</Link>
          }>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td style={{ fontSize: '0.8rem' }}>{user.email}</td>
                    <td>{user.city}</td>
                    <td>{new Date(user.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
