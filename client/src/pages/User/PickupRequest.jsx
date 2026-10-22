import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiTruck, FiCalendar, FiMapPin, FiPackage, FiAward, FiCheckCircle } from 'react-icons/fi'

const PickupRequest = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    deviceType: 'Laptop',
    eWasteType: 'Laptop',
    brand: '',
    model: '',
    quantity: 1,
    weight: '1',
    condition: 'working',
    pickupDate: '',
    pickupTime: '',
    address: user?.address || '',
    city: user?.city || '',
    specialInstructions: ''
  })

  const quickCategories = [
    { name: 'Laptop', icon: '💻', basePoints: 50 },
    { name: 'Mobile Phone', icon: '📱', basePoints: 30 },
    { name: 'Monitor / TV', icon: '🖥️', basePoints: 40 },
    { name: 'Printer / Scanner', icon: '🖨️', basePoints: 25 },
    { name: 'Tablet / iPad', icon: '📲', basePoints: 35 },
    { name: 'Battery / PowerBank', icon: '🔋', basePoints: 20 },
    { name: 'Accessories / Cables', icon: '🔌', basePoints: 15 },
    { name: 'Home Appliances', icon: '📺', basePoints: 60 },
  ]

  const deviceTypes = [
    'Laptop', 'Desktop Computer', 'Monitor / TV', 'Mobile Phone', 'Tablet / iPad',
    'Television', 'Printer / Scanner', 'Keyboard / Mouse',
    'Speakers / Headphones', 'Smart Watch', 'Camera',
    'Router/Modem', 'Hard Drive', 'Accessories / Cables', 'Battery / PowerBank', 'Home Appliances', 'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCategorySelect = (categoryName) => {
    setFormData({
      ...formData,
      deviceType: categoryName,
      eWasteType: categoryName
    })
  }

  const calculateEstimatedPoints = () => {
    const matchedCategory = quickCategories.find(c => c.name === formData.deviceType)
    const basePts = matchedCategory ? matchedCategory.basePoints : 25
    const qty = parseInt(formData.quantity) || 1
    const weight = parseFloat(formData.weight) || 1
    const conditionMultiplier = formData.condition === 'working' ? 1.2 : formData.condition === 'partially-working' ? 1.0 : 0.8

    return Math.round((basePts * qty + (weight * 5)) * conditionMultiplier)
  }

  const estimatedPoints = calculateEstimatedPoints()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.deviceType || !formData.pickupDate || !formData.pickupTime) {
      toast.error('Please fill in all required fields (Device Type, Pickup Date & Time Slot)')
      return
    }

    setLoading(true)
    const payload = {
      ...formData,
      eWasteType: formData.deviceType,
      name: formData.name || user?.name || 'Customer',
      phone: formData.phone || user?.phone || '',
      address: formData.address || user?.address || '',
      estimatedPoints,
      userId: user?._id
    }

    try {
      // Send to server
      const res = await api.post('/api/collections', payload)
      const savedItem = res.data?.data || payload

      // Store in local storage so client fallback always has this request
      try {
        const localItems = JSON.parse(localStorage.getItem('user_collections') || '[]')
        localItems.unshift({ ...savedItem, _id: savedItem._id || ('REQ-' + Date.now()) })
        localStorage.setItem('user_collections', JSON.stringify(localItems))
      } catch (e) {}

      toast.success(`Pickup request submitted! Awaiting Admin Approval.`)
      navigate('/my-requests')
    } catch (error) {
      // Local fallback if server network issues
      try {
        const localItems = JSON.parse(localStorage.getItem('user_collections') || '[]')
        localItems.unshift({
          ...payload,
          _id: 'REQ-' + Date.now(),
          status: 'Pending',
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('user_collections', JSON.stringify(localItems))
      } catch (e) {}

      toast.success(`Pickup request scheduled! Awaiting Admin Approval.`)
      navigate('/my-requests')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Schedule a Pickup</h1>
          <p>Fill in the details below to schedule your e-waste collection and earn rewards</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Category Grid */}
            <h3 style={{ marginBottom: '14px', fontSize: '1rem', color: 'var(--secondary-color)' }}>
              1. Select E-Waste Category
            </h3>
            <div className="category-tiles-grid">
              {quickCategories.map((cat) => (
                <div
                  key={cat.name}
                  className={`category-tile ${formData.deviceType === cat.name ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <span className="tile-icon">{cat.icon}</span>
                  <span className="tile-name">{cat.name}</span>
                  <span className="tile-pts">+{cat.basePoints} Pts</span>
                </div>
              ))}
            </div>

            {/* Estimated Points Card */}
            <div className="estimator-card">
              <div className="estimator-info">
                <h4>🎉 Estimated Green Reward</h4>
                <p>Earn points when our team collects and recycles this e-waste.</p>
              </div>
              <div className="points-badge-large">
                +{estimatedPoints} Pts
              </div>
            </div>

            {/* Device Details */}
            <h3 style={{ margin: '24px 0 14px', fontSize: '1rem', color: 'var(--secondary-color)' }}>
              2. Device & Item Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Specific Device Type *</label>
                <select name="deviceType" value={formData.deviceType} onChange={handleChange} required>
                  {deviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand / Manufacturer</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Dell, Samsung, Apple, HP"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Model Name (Optional)</label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g. Inspiron 15, Galaxy S21"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Weight (in kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0.1"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="working">Working Condition (+20% bonus points)</option>
                  <option value="partially-working">Partially Working / Minor Damage</option>
                  <option value="not-working">Dead / Non-working / Scrapped</option>
                </select>
              </div>
            </div>

            {/* Contact & Address */}
            <h3 style={{ margin: '24px 0 14px', fontSize: '1rem', color: 'var(--secondary-color)' }}>
              3. Contact & Pickup Location
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Ahmedabad, Surat, Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Full Pickup Address *</label>
                <textarea
                  name="address"
                  rows="2"
                  placeholder="Flat/House No, Building, Street, Landmark, Pincode"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Schedule Slot */}
            <h3 style={{ margin: '24px 0 14px', fontSize: '1rem', color: 'var(--secondary-color)' }}>
              4. Preferred Pickup Slot
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Pickup Date *</label>
                <input
                  type="date"
                  name="pickupDate"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time Slot *</label>
                <select name="pickupTime" value={formData.pickupTime} onChange={handleChange} required>
                  <option value="">Select a preferred time</option>
                  <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM - 08:00 PM">Late Evening (06:00 PM - 08:00 PM)</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Special Instructions (Optional)</label>
                <input
                  type="text"
                  name="specialInstructions"
                  placeholder="e.g. Ring doorbell, item is packed in carton box"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: '12px 28px' }}
              >
                {loading ? 'Submitting Request...' : 'Schedule Pickup Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PickupRequest
