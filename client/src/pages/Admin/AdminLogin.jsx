import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiLock, FiShield, FiMail, FiArrowRight } from 'react-icons/fi'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/admin/login', formData)
      login(data.user)
      toast.success('Admin login successful!')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon-badge" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>
            <FiShield />
          </div>
          <h2>Admin Portal</h2>
          <p className="auth-subtitle">Restricted access for system administrators</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Admin Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 8px 20px -6px rgba(239, 68, 68, 0.4)' }}
          >
            {loading ? 'Signing In...' : (
              <>
                Admin Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ fontSize: '0.85rem' }}>
            User account? <Link to="/login">User Sign In →</Link>
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '8px' }}>
            🔒 Authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
