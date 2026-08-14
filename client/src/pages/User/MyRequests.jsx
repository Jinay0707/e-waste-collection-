import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { FiClock, FiCheckCircle, FiTruck, FiUser, FiAward, FiSearch, FiXCircle, FiFileText } from 'react-icons/fi'

function MyRequests() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const [requestsList, setRequestsList] = useState([
    {
      id: 'REQ-1049',
      device: 'Laptop',
      brand: 'Dell XPS 15',
      qty: 1,
      weight: '2.5 kg',
      date: '2024-01-28',
      time: '02:00 PM - 04:00 PM',
      status: 'Collector Assigned',
      stepLevel: 3, // 1: Requested, 2: Confirmed, 3: Collector Assigned, 4: Out for Pickup, 5: Recycled
      points: 55,
      collector: { name: 'Rajesh Kumar', phone: '+91 98765 12345', vehicle: 'GJ-01-EV-4092' },
      address: 'B-402, Green Acres Apartment, Satellite, Ahmedabad'
    },
    {
      id: 'REQ-1042',
      device: 'Mobile Phone',
      brand: 'Samsung Galaxy S21',
      qty: 1,
      weight: '0.4 kg',
      date: '2024-01-25',
      time: '09:00 AM - 11:00 AM',
      status: 'Pending',
      stepLevel: 1,
      points: 30,
      collector: null,
      address: 'B-402, Green Acres Apartment, Satellite, Ahmedabad'
    },
    {
      id: 'REQ-1031',
      device: 'Monitor',
      brand: 'LG UltraWide 34"',
      qty: 1,
      weight: '6.0 kg',
      date: '2024-01-20',
      time: '11:00 AM - 01:00 PM',
      status: 'Completed',
      stepLevel: 5,
      points: 45,
      collector: { name: 'Amit Sharma', phone: '+91 98234 56789', vehicle: 'GJ-01-EV-2019' },
      address: 'B-402, Green Acres Apartment, Satellite, Ahmedabad'
    },
    {
      id: 'REQ-1015',
      device: 'Keyboard & Mouse',
      brand: 'Logitech MX Keys',
      qty: 2,
      weight: '1.2 kg',
      date: '2024-01-10',
      time: '04:00 PM - 06:00 PM',
      status: 'Completed',
      stepLevel: 5,
      points: 25,
      collector: { name: 'Amit Sharma', phone: '+91 98234 56789', vehicle: 'GJ-01-EV-2019' },
      address: 'B-402, Green Acres Apartment, Satellite, Ahmedabad'
    }
  ])

  // Filter requests based on search and status
  const filteredRequests = requestsList.filter(req => {
    const matchesSearch = req.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const cancelRequest = (id) => {
    if (window.confirm('Are you sure you want to cancel this pickup request?')) {
      setRequestsList(requestsList.map(r => r.id === id ? { ...r, status: 'Cancelled', stepLevel: 0 } : r))
    }
  }

  // Active request for the status timeline stepper preview
  const activeRequest = requestsList.find(r => r.status !== 'Completed' && r.status !== 'Cancelled') || requestsList[0]

  const steps = [
    { label: 'Requested', level: 1 },
    { label: 'Confirmed', level: 2 },
    { label: 'Agent Assigned', level: 3 },
    { label: 'Out for Pickup', level: 4 },
    { label: 'Recycled & Rewarded', level: 5 }
  ]

  const getProgressPercentage = (stepLevel) => {
    if (stepLevel <= 0) return 0
    return ((stepLevel - 1) / (steps.length - 1)) * 100
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>My Pickup Requests & Live Tracking</h1>
          <p>Track your e-waste collection status in real-time and view recycling certificates</p>
        </div>

        {/* Live Visual Status Timeline Stepper Banner for Active Request */}
        {activeRequest && (
          <div className="card glass-card" style={{ borderLeft: '4px solid var(--primary-color)', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>{activeRequest.id}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>
                  Active Request: {activeRequest.device} ({activeRequest.brand})
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                  Scheduled Date: <strong>{activeRequest.date}</strong> | Slot: <strong>{activeRequest.time}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${activeRequest.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {activeRequest.status}
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '4px' }}>
                  Reward: ⭐ +{activeRequest.points} Points
                </p>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="status-timeline-container">
              <div className="status-timeline">
                <div className="status-line-background"></div>
                <div className="status-line-progress" style={{ width: `${getProgressPercentage(activeRequest.stepLevel)}%` }}></div>

                {steps.map((step) => {
                  const isActive = activeRequest.stepLevel === step.level
                  const isCompleted = activeRequest.stepLevel > step.level || activeRequest.stepLevel === 5

                  return (
                    <div key={step.level} className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                      <div className="step-dot">
                        {isCompleted ? <FiCheckCircle /> : step.level}
                      </div>
                      <span className="step-label">{step.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Eco Agent Info if Assigned */}
            {activeRequest.collector && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--primary-light)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', marginTop: '15px' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>
                  <FiTruck />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--primary-dark)' }}>Assigned Pickup Agent: {activeRequest.collector.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--dark-gray)' }}>
                    Phone: {activeRequest.collector.phone} | Vehicle: {activeRequest.collector.vehicle}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters Section */}
        <div className="filters" style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--gray)' }} />
            <input
              type="text"
              placeholder="Search by ID, device type, or brand..."
              className="search-box"
              style={{ paddingLeft: '40px', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Collector Assigned</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* All Requests Table Card */}
        <div className="dashboard-card glass-card">
          <h2>All Pickup Requests ({filteredRequests.length})</h2>

          <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '15px' }}>
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Device & Brand</th>
                  <th>Pickup Slot</th>
                  <th>Est. Weight</th>
                  <th>Status</th>
                  <th>Reward Points</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td>
                        <strong>{req.device}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{req.brand} (Qty: {req.qty})</div>
                      </td>
                      <td>
                        {req.date}
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{req.time}</div>
                      </td>
                      <td>{req.weight}</td>
                      <td>
                        <span className={`status ${req.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>⭐ +{req.points}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {req.status === 'Completed' && (
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => setSelectedRequest(req)}
                            >
                              <FiFileText /> Certificate
                            </button>
                          )}
                          {(req.status === 'Pending' || req.status === 'Scheduled' || req.status === 'Collector Assigned') && (
                            <button
                              className="cancel-btn"
                              onClick={() => cancelRequest(req.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>
                      No pickup requests found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certificate Modal Preview */}
        {selectedRequest && (
          <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '10px' }}>📜</div>
              <h2 style={{ color: 'var(--secondary-color)' }}>Official Recycling Certificate</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', margin: '6px 0 20px 0' }}>
                Issued by E-Waste Collection Portal for verified eco-friendly recycling.
              </p>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p><strong>Certificate ID:</strong> CERT-{selectedRequest.id}</p>
                <p><strong>Device Recycled:</strong> {selectedRequest.device} ({selectedRequest.brand})</p>
                <p><strong>Recycling Date:</strong> {selectedRequest.date}</p>
                <p><strong>Eco Points Awarded:</strong> ⭐ {selectedRequest.points} Green Points</p>
                <p><strong>Environmental Impact:</strong> ~1.8 kg CO₂ Saved from Atmosphere</p>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setSelectedRequest(null)}
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRequests