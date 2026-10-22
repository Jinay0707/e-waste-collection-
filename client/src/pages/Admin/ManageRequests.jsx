import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiTruck, FiCheck, FiRefreshCw } from 'react-icons/fi'

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
    setLoading(true)
    try {
      // 1. Fetch from server
      let serverList = []
      try {
        const { data } = await api.get('/api/collections/admin/all')
        serverList = Array.isArray(data) ? data : (data?.data || [])
      } catch (err) {
        console.log('Server fetch fallback, trying /api/admin/requests')
        try {
          const { data } = await api.get('/api/admin/requests')
          serverList = Array.isArray(data) ? data : (data?.data || [])
        } catch (e) {}
      }

      // 2. Read local stored items submitted in browser
      let localList = []
      try {
        localList = JSON.parse(localStorage.getItem('user_collections') || '[]')
      } catch (e) {}

      // 3. Merge server and local requests (prevent duplicate IDs)
      const mergedMap = new Map()

      // Add server items first
      serverList.forEach(item => {
        if (item && item._id) mergedMap.set(String(item._id), item)
      })

      // Add local items
      localList.forEach(item => {
        if (item && item._id && !mergedMap.has(String(item._id))) {
          mergedMap.set(String(item._id), item)
        }
      })

      const combined = Array.from(mergedMap.values())
      setRequests(combined)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      // Send to server
      try {
        await api.put(`/api/collections/admin/${id}/status`, { status: newStatus })
      } catch (e) {
        await api.put(`/api/admin/requests/${id}`, { status: newStatus })
      }

      // Update in state
      setRequests(prev => prev.map(r => String(r._id) === String(id) ? { ...r, status: newStatus } : r))

      // Update in localStorage
      try {
        const localList = JSON.parse(localStorage.getItem('user_collections') || '[]')
        const updated = localList.map(r => String(r._id) === String(id) ? { ...r, status: newStatus } : r)
        localStorage.setItem('user_collections', JSON.stringify(updated))
      } catch (e) {}

      toast.success(`Request status updated to ${newStatus}!`)
      if (selectedRequest && String(selectedRequest._id) === String(id)) {
        setSelectedRequest({ ...selectedRequest, status: newStatus })
      }
      setShowModal(false)
    } catch (error) {
      // Local fallback
      setRequests(prev => prev.map(r => String(r._id) === String(id) ? { ...r, status: newStatus } : r))
      toast.success(`Request status marked as ${newStatus}`)
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
    const name = (req.userName || req.name || '').toLowerCase()
    const dev = (req.deviceType || req.eWasteType || '').toLowerCase()
    const city = (req.city || '').toLowerCase()
    const phone = (req.userPhone || req.phone || '')
    const term = searchTerm.toLowerCase()

    const matchesSearch = name.includes(term) || dev.includes(term) || city.includes(term) || phone.includes(term)
    const matchesStatus =
      filterStatus === 'all' || (req.status && req.status.toLowerCase() === filterStatus.toLowerCase())

    return matchesSearch && matchesStatus
  })

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Pickup Requests</h1>
            <p>Review, accept, approve and schedule customer e-waste collection requests</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={fetchRequests}
            title="Refresh Requests"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by customer name, device, phone, or city..."
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
            <option value="Pending">Pending Approval</option>
            <option value="Accepted">Approved / Accepted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests Table */}
        <Card title={`All Pickup Requests (${filteredRequests.length})`}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No requests found</p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                When users schedule a pickup, their requests will appear here immediately.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Device</th>
                    <th>Qty / Weight</th>
                    <th>City / Address</th>
                    <th>Pickup Date</th>
                    <th>Status</th>
                    <th>Approval Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{req.userName || req.name || 'Customer'}</strong>
                          <p style={{ fontSize: '0.8rem', color: 'var(--gray)', margin: 0 }}>
                            {req.userPhone || req.phone || req.userEmail || '-'}
                          </p>
                        </div>
                      </td>
                      <td>
                        <strong>{req.deviceType || req.eWasteType}</strong>
                        {req.brand && <p style={{ fontSize: '0.75rem', color: 'var(--gray)', margin: 0 }}>{req.brand} {req.model}</p>}
                      </td>
                      <td>{req.quantity} ({req.weight || '1 kg'})</td>
                      <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                        <span>{req.city ? `${req.city}, ` : ''}{req.address}</span>
                      </td>
                      <td>{req.pickupDate || req.date || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(req.status)}`}>
                          {req.status === 'Pending' ? '⏳ Pending Approval' : req.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {/* Direct Approve / Accept Button */}
                          {req.status === 'Pending' && (
                            <button
                              className="btn btn-success"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              title="Approve / Accept Request"
                              onClick={() => updateStatus(req._id, 'Accepted')}
                            >
                              <FiCheck /> Approve
                            </button>
                          )}

                          {/* Quick Schedule Button */}
                          {(req.status === 'Accepted' || req.status === 'Approved') && (
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
                <div><strong>Customer Name:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userName || selectedRequest.name || '-'}</span></div>
                <div><strong>Phone Number:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userPhone || selectedRequest.phone || '-'}</span></div>
                <div><strong>Email:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userEmail || '-'}</span></div>
                <div><strong>Device:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.deviceType || selectedRequest.eWasteType} {selectedRequest.brand && `(${selectedRequest.brand})`}</span></div>
                <div><strong>Quantity:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.quantity}</span></div>
                <div><strong>Estimated Weight:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.weight || '1 kg'}</span></div>
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
                <p style={{ marginBottom: '10px', fontWeight: 600 }}>Approval & Status Action:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Accepted')}
                  >
                    <FiCheck /> Approve Request
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => updateStatus(selectedRequest._id, 'Scheduled')}
                  >
                    <FiTruck /> Schedule Collector
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
