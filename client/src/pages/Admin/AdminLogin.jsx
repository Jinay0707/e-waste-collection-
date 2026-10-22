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
      login({ ...data.user, token: data.token })
      toast.success('Admin login successful!')
      navigate('/admin/dashboard')
    } catch (error) {
      // Fallback for standalone / client-only mode
      if (
        (formData.email === 'admin@example.com' && formData.password === 'admin123') ||
        (formData.email === 'admin@ewaste.com' && formData.password === 'admin123')
      ) {
        login({
          _id: 'admin_local_1',
          name: 'System Administrator',
          email: formData.email,
          role: 'admin',
          token: 'mock_admin_token'
        })
        toast.success('Admin login successful!')
        navigate('/admin/dashboard')
      } else {
        toast.error(error.response?.data?.message || 'Admin login failed. Please try again.')
      }
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

        <div className="demo-credentials-box" style={{ borderColor: '#fecaca', background: '#fff5f5' }}>
          <div>
            <p style={{ fontWeight: 600, color: '#991b1b' }}>⚡ Quick Admin Demo</p>
            <p style={{ color: '#b91c1c' }}>admin@example.com / admin123</p>
          </div>
          <button
            type="button"
            className="demo-fill-btn"
            style={{ background: '#ef4444', color: '#fff', border: 'none' }}
            onClick={() => setFormData({ email: 'admin@example.com', password: 'admin123' })}
          >
            Auto Fill
          </button>
        </div>

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
