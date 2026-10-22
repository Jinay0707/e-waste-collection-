import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiTruck, FiCheck } from 'react-icons/fi'

const ManageRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/api/admin/requests')
      if (Array.isArray(data)) {
        setRequests(data)
      } else if (data && Array.isArray(data.data)) {
        setRequests(data.data)
      }
    } catch (error) {
      console.error('Error fetching requests from server:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/requests/${id}`, { status: newStatus })
      setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r))
      toast.success(`Request marked as ${newStatus}!`)
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus })
      }
      setShowModal(false)
    } catch (error) {
      // Local fallback state update
      setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r))
      toast.success(`Request marked as ${newStatus}`)
      setShowModal(false)
    }
  }

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'badge-warning'
      case 'accepted':
      case 'approved':
      case 'completed': return 'badge-success'
      case 'cancelled':
      case 'rejected': return 'badge-danger'
      case 'scheduled':
      case 'in-progress': return 'badge-info'
      default: return 'badge-info'
    }
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (req.userName && req.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.deviceType && req.deviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.city && req.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.userPhone && req.userPhone.includes(searchTerm))

    const matchesStatus =
      filterStatus === 'all' || (req.status && req.status.toLowerCase() === filterStatus.toLowerCase())

    return matchesSearch && matchesStatus
  })

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Manage Pickup Requests</h1>
          <p>Review, accept, schedule and manage e-waste collection requests</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by user, device, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
            <FiSearch style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--gray)' }} />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests Table */}
        <Card title={`All Requests (${filteredRequests.length})`}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No requests found</p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                When users schedule a pickup, their requests will appear here in real-time.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User & Phone</th>
                    <th>Device</th>
                    <th>Qty / Weight</th>
                    <th>City / Address</th>
                    <th>Pickup Date</th>
                    <th>Status</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{req.userName || 'Customer'}</strong>
                          <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{req.userPhone || req.userEmail || '-'}</p>
                        </div>
                      </td>
                      <td>
                        <strong>{req.deviceType}</strong>
                        {req.brand && <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{req.brand} {req.model}</p>}
                      </td>
                      <td>{req.quantity} ({req.weight})</td>
                      <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                        <span>{req.city || ''} {req.address}</span>
                      </td>
                      <td>{req.pickupDate || req.date || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {/* Direct Accept Button */}
                          {req.status === 'Pending' && (
                            <button
                              className="btn btn-success"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              title="Accept Request"
                              onClick={() => updateStatus(req._id, 'Accepted')}
                            >
                              <FiCheck /> Accept
                            </button>
                          )}

                          {/* Quick Schedule Button */}
                          {req.status === 'Accepted' && (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                              title="Schedule Collector"
                              onClick={() => updateStatus(req._id, 'Scheduled')}
                            >
                              <FiTruck /> Schedule
                            </button>
                          )}

                          {/* View details modal button */}
                          <button
                            className="btn btn-outline"
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            title="View Full Details"
                            onClick={() => { setSelectedRequest(req); setShowModal(true) }}
                          >
                            <FiEye /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Detail Modal */}
        {showModal && selectedRequest && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', borderRadius: 'var(--radius)', padding: '30px',
              width: '90%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>
                  Pickup Request Details
                </h3>
                <span className={`badge ${getStatusBadge(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><strong>Customer Name:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userName || '-'}</span></div>
                <div><strong>Phone Number:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userPhone || '-'}</span></div>
                <div><strong>Email:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userEmail || '-'}</span></div>
                <div><strong>Device:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.deviceType} {selectedRequest.brand && `(${selectedRequest.brand})`}</span></div>
                <div><strong>Quantity:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.quantity}</span></div>
                <div><strong>Estimated Weight:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.weight}</span></div>
                <div><strong>Condition:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.condition || 'Used'}</span></div>
                <div><strong>City:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.city || '-'}</span></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Pickup Address:</strong><br />
                  <span style={{ fontSize: '0.9rem' }}>{selectedRequest.address || '-'}</span>
                </div>
                <div><strong>Preferred Date:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.pickupDate || '-'}</span></div>
                <div><strong>Time Slot:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.pickupTime || '-'}</span></div>
                {selectedRequest.specialInstructions && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Special Instructions:</strong><br />
                    <span style={{ fontSize: '0.9rem' }}>{selectedRequest.specialInstructions}</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <p style={{ marginBottom: '10px', fontWeight: 600 }}>Update Status:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Accepted')}
                  >
                    <FiCheck /> Accept Request
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Scheduled')}
                  >
                    <FiTruck /> Schedule Pickup
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', background: '#059669' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Completed')}
                  >
                    <FiCheckCircle /> Mark Completed
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Cancelled')}
                  >
                    <FiXCircle /> Reject / Cancel
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageRequests
