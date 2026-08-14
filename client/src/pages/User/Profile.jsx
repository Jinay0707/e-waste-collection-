import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiShield } from 'react-icons/fi'

const Profile = () => {
  const { user } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    profileImage: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        profileImage: user.profileImage || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.put('/api/user/profile', formData)
      toast.success('Profile updated successfully!')
      setEditMode(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Profile Info Card */}
          <Card title={<><FiUser /> Profile Information</>} headerAction={
            !editMode && (
              <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => setEditMode(true)}>
                <FiEdit2 /> Edit
              </button>
            )
          }>
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiUser style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Name</p>
                      <p style={{ fontWeight: 500 }}>{formData.name}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMail style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Email</p>
                      <p style={{ fontWeight: 500 }}>{formData.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiPhone style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Phone</p>
                      <p style={{ fontWeight: 500 }}>{formData.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMapPin style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Address</p>
                      <p style={{ fontWeight: 500 }}>{formData.address}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMapPin style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>City</p>
                      <p style={{ fontWeight: 500 }}>{formData.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Account Info Card */}
          <Card title={<><FiShield /> Account Information</>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Member Since</p>
                <p style={{ fontWeight: 500 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'January 2024'}</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Account Status</p>
                <p style={{ fontWeight: 500, color: 'var(--primary-color)' }}>Active</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Total Pickups</p>
                <p style={{ fontWeight: 500 }}>8 requests</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Reward Points</p>
                <p style={{ fontWeight: 500, color: 'var(--primary-color)' }}>350 points</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Change Password */}
        <Card title="Change Password">
          <div style={{ maxWidth: '400px' }}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '10px' }}>
              Update Password
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile
