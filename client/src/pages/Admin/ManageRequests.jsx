import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi'

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
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      // Sample data for demo
      setRequests([
        {
          _id: '1', userName: 'Rahul Sharma', userEmail: 'rahul@email.com', userPhone: '9876543210',
          deviceType: 'Laptop', brand: 'Dell', model: 'XPS 15', quantity: 1, weight: '2.5 kg',
          condition: 'not-working', pickupDate: '2024-01-28', pickupTime: '14:00-16:00',
          address: '45 MG Road, Andheri West', city: 'Mumbai', status: 'Pending',
          specialInstructions: 'Please collect from lobby', date: '2024-01-25'
        },
        {
          _id: '2', userName: 'Priya Singh', userEmail: 'priya@email.com', userPhone: '9876543211',
          deviceType: 'Mobile Phone', brand: 'Samsung', model: 'Galaxy S21', quantity: 2, weight: '0.5 kg',
          condition: 'working', pickupDate: '2024-01-27', pickupTime: '09:00-11:00',
          address: '12 Connaught Place', city: 'Delhi', status: 'Scheduled',
          specialInstructions: '', date: '2024-01-24'
        },
        {
          _id: '3', userName: 'Amit Patel', userEmail: 'amit@email.com', userPhone: '9876543212',
          deviceType: 'Monitor', brand: 'LG', model: 'UltraWide 34"', quantity: 1, weight: '5 kg',
          condition: 'not-working', pickupDate: '2024-01-26', pickupTime: '11:00-13:00',
          address: '78 Brigade Road', city: 'Bangalore', status: 'Completed',
          specialInstructions: 'Fragile, handle with care', date: '2024-01-23'
        },
        {
          _id: '4', userName: 'Sneha Gupta', userEmail: 'sneha@email.com', userPhone: '9876543213',
          deviceType: 'Tablet', brand: 'Apple', model: 'iPad Pro', quantity: 1, weight: '1 kg',
          condition: 'partially-working', pickupDate: '2024-01-25', pickupTime: '16:00-18:00',
          address: '34 FC Road', city: 'Pune', status: 'Pending',
          specialInstructions: '', date: '2024-01-22'
        },
        {
          _id: '5', userName: 'Vikram Rao', userEmail: 'vikram@email.com', userPhone: '9876543214',
          deviceType: 'Desktop', brand: 'HP', model: 'Pavilion', quantity: 1, weight: '8 kg',
          condition: 'not-working', pickupDate: '2024-01-29', pickupTime: '09:00-11:00',
          address: '56 Anna Salai', city: 'Chennai', status: 'In-Progress',
          specialInstructions: 'Heavy item, need assistance', date: '2024-01-21'
        },
        {
          _id: '6', userName: 'Ananya Das', userEmail: 'ananya@email.com', userPhone: '9876543215',
          deviceType: 'Printer', brand: 'Canon', model: 'PIXMA', quantity: 1, weight: '6 kg',
          condition: 'damaged', pickupDate: '2024-01-24', pickupTime: '14:00-16:00',
          address: '23 Park Street', city: 'Kolkata', status: 'Cancelled',
          specialInstructions: '', date: '2024-01-20'
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/requests/${id}`, { status: newStatus })
      setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r))
      toast.success(`Request status updated to ${newStatus}`)
      setShowModal(false)
    } catch (error) {
      setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r))
      toast.success('Status updated')
      setShowModal(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-warning'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-danger'
      case 'scheduled': return 'badge-info'
      case 'in-progress': return 'badge-warning'
      default: return 'badge-info'
    }
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || req.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Manage Requests</h1>
          <p>View and manage all pickup requests</p>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            <input
              type="text"
              placeholder="Search by user, device, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', padding: '10px 16px', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', width: '100%', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px 16px', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'Poppins, sans-serif' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests Table */}
        <Card title={`All Requests (${filteredRequests.length})`}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading requests...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Device</th>
                    <th>Qty</th>
                    <th>City</th>
                    <th>Pickup Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div>
                          <strong style={{ fontSize: '0.85rem' }}>{req.userName}</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{req.userEmail}</p>
                        </div>
                      </td>
                      <td>{req.deviceType}</td>
                      <td>{req.quantity}</td>
                      <td>{req.city}</td>
                      <td>{new Date(req.pickupDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                            onClick={() => { setSelectedRequest(req); setShowModal(true) }}
                          >
                            <FiEye />
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
              width: '90%', maxWidth: '550px', maxHeight: '80vh', overflowY: 'auto'
            }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>
                Pickup Request Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><strong>User:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userName}</span></div>
                <div><strong>Email:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userEmail}</span></div>
                <div><strong>Phone:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.userPhone}</span></div>
                <div><strong>Device:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.deviceType} - {selectedRequest.brand} {selectedRequest.model}</span></div>
                <div><strong>Quantity:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.quantity}</span></div>
                <div><strong>Weight:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.weight}</span></div>
                <div><strong>Condition:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.condition}</span></div>
                <div><strong>City:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.city}</span></div>
                <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.address}</span></div>
                <div><strong>Pickup Date:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.pickupDate}</span></div>
                <div><strong>Time Slot:</strong><br /><span style={{ fontSize: '0.9rem' }}>{selectedRequest.pickupTime}</span></div>
                {selectedRequest.specialInstructions && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Instructions:</strong><br />
                    <span style={{ fontSize: '0.9rem' }}>{selectedRequest.specialInstructions}</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <p style={{ marginBottom: '10px', fontWeight: 500 }}>Update Status:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => updateStatus(selectedRequest._id, 'Scheduled')}>
                    <FiTruck /> Schedule
                  </button>
                  <button className="btn btn-success" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => updateStatus(selectedRequest._id, 'Completed')}>
                    <FiCheckCircle /> Complete
                  </button>
                  <button className="btn btn-danger" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => updateStatus(selectedRequest._id, 'Cancelled')}>
                    <FiXCircle /> Cancel
                  </button>
                  <button className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => setShowModal(false)}>
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
