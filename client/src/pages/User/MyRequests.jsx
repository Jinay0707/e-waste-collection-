import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { FiClock, FiCheckCircle, FiTruck, FiSearch, FiXCircle, FiAlertCircle } from 'react-icons/fi'

function MyRequests() {
  const { user } = useAuth()
  const [requestsList, setRequestsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      const { data } = await api.get('/api/collections/user')
      const items = Array.isArray(data) ? data : (data.data || [])
      setRequestsList(items)
    } catch (error) {
      console.log('Error fetching user requests, using demo data:', error)
      setRequestsList([
        {
          _id: 'REQ-1042',
          deviceType: 'Mobile Phone',
          brand: 'Samsung Galaxy S21',
          quantity: 1,
          weight: '0.4 kg',
          pickupDate: '2024-01-25',
          pickupTime: '09:00 AM - 11:00 AM',
          status: 'Pending',
          estimatedPoints: 30,
          address: 'Satellite, Ahmedabad'
        },
        {
          _id: 'REQ-1049',
          deviceType: 'Laptop',
          brand: 'Dell XPS 15',
          quantity: 1,
          weight: '2.5 kg',
          pickupDate: '2024-01-28',
          pickupTime: '02:00 PM - 04:00 PM',
          status: 'Approved',
          estimatedPoints: 55,
          address: 'Satellite, Ahmedabad'
        },
        {
          _id: 'REQ-1031',
          deviceType: 'Monitor',
          brand: 'LG UltraWide 34"',
          quantity: 1,
          weight: '6.0 kg',
          pickupDate: '2024-01-20',
          pickupTime: '11:00 AM - 01:00 PM',
          status: 'Completed',
          estimatedPoints: 45,
          address: 'Satellite, Ahmedabad'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const cancelRequest = async (id) => {
    if (window.confirm('Are you sure you want to cancel this pickup request?')) {
      try {
        await api.put(`/api/admin/requests/${id}`, { status: 'Cancelled' })
        setRequestsList(requestsList.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r))
      } catch (err) {
        setRequestsList(requestsList.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r))
      }
    }
  }

  // Filter requests
  const filteredRequests = requestsList.filter(req => {
    const dev = (req.deviceType || req.eWasteType || '').toLowerCase()
    const brand = (req.brand || '').toLowerCase()
    const id = (req._id || '').toLowerCase()
    const term = searchTerm.toLowerCase()

    const matchesSearch = dev.includes(term) || brand.includes(term) || id.includes(term)
    const matchesStatus = statusFilter === 'All Status' || (req.status || 'Pending').toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Stepper helper
  const getStepLevel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 1 // Awaiting Admin Approval
      case 'approved':
      case 'accepted': return 2 // Approved by Admin
      case 'scheduled':
      case 'in-progress': return 3 // Collector Scheduled
      case 'out for pickup': return 4 // Out for collection
      case 'completed': return 5 // Picked up & Rewarded
      default: return 1
    }
  }

  const steps = [
    { label: 'Submitted (Pending Approval)', level: 1 },
    { label: 'Admin Approved', level: 2 },
    { label: 'Collector Scheduled', level: 3 },
    { label: 'Out for Pickup', level: 4 },
    { label: 'Completed & Rewarded', level: 5 }
  ]

  const activeRequest = requestsList.find(r => r.status !== 'Completed' && r.status !== 'Cancelled') || requestsList[0]
  const currentStep = activeRequest ? getStepLevel(activeRequest.status) : 1

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>My Pickup Requests</h1>
          <p style={{ color: 'var(--gray)' }}>
            Track the approval and live pickup status of your submitted e-waste requests
          </p>
        </div>

        {/* Live Stepper Tracker */}
        {activeRequest && activeRequest.status !== 'Cancelled' && (
          <div className="dashboard-card" style={{ marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)' }}>ACTIVE REQUEST</span>
                <h3 style={{ margin: '2px 0', color: 'var(--secondary-color)' }}>
                  {activeRequest.deviceType || activeRequest.eWasteType} {activeRequest.brand ? `(${activeRequest.brand})` : ''}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', margin: 0 }}>
                  Pickup Date: <strong>{activeRequest.pickupDate || 'Scheduled'}</strong>
                </p>
              </div>

              <div>
                {activeRequest.status === 'Pending' ? (
                  <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    ⏳ Awaiting Admin Approval
                  </span>
                ) : activeRequest.status === 'Approved' || activeRequest.status === 'Accepted' ? (
                  <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    ✅ Approved by Admin
                  </span>
                ) : activeRequest.status === 'Completed' ? (
                  <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    🎉 Completed (+{activeRequest.estimatedPoints || 25} Pts)
                  </span>
                ) : (
                  <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    🚚 {activeRequest.status}
                  </span>
                )}
              </div>
            </div>

            {/* Visual Steps Timeline */}
            <div className="status-timeline-container" style={{ marginTop: '20px' }}>
              <div className="status-timeline">
                <div className="status-line-background" />
                <div
                  className="status-line-progress"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 90}%` }}
                />

                {steps.map((st) => (
                  <div
                    key={st.level}
                    className={`timeline-step ${currentStep >= st.level ? 'active' : ''} ${currentStep > st.level ? 'completed' : ''}`}
                  >
                    <div className="step-dot">
                      {currentStep > st.level ? '✓' : st.level}
                    </div>
                    <span className="step-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            className="search-box"
            placeholder="Search request or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="dashboard-card">
          <h3 style={{ marginBottom: '15px' }}>Pickup History</h3>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>Loading your requests...</p>
          ) : filteredRequests.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>No pickup requests found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Qty / Weight</th>
                    <th>Pickup Date & Slot</th>
                    <th>Points</th>
                    <th>Approval Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <strong>{req.deviceType || req.eWasteType}</strong>
                        {req.brand && <p style={{ fontSize: '0.75rem', color: 'var(--gray)', margin: 0 }}>{req.brand}</p>}
                      </td>
                      <td>{req.quantity} ({req.weight || '1 kg'})</td>
                      <td>
                        <span>{req.pickupDate || '-'}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray)', margin: 0 }}>{req.pickupTime || ''}</p>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)' }}>+{req.estimatedPoints || 25} Pts</strong>
                      </td>
                      <td>
                        {req.status === 'Pending' ? (
                          <span className="status pending" title="Waiting for admin to review">
                            ⏳ Pending Approval
                          </span>
                        ) : req.status === 'Approved' || req.status === 'Accepted' ? (
                          <span className="status completed" title="Admin has approved this request">
                            ✅ Approved
                          </span>
                        ) : req.status === 'Completed' ? (
                          <span className="status completed">
                            ✓ Completed
                          </span>
                        ) : req.status === 'Cancelled' ? (
                          <span className="status" style={{ background: '#fef2f2', color: '#dc2626' }}>
                            ✕ Cancelled
                          </span>
                        ) : (
                          <span className="status scheduled">
                            🚚 {req.status}
                          </span>
                        )}
                      </td>
                      <td>
                        {req.status === 'Pending' && (
                          <button
                            className="cancel-btn"
                            onClick={() => cancelRequest(req._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyRequests
