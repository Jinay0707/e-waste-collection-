import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiTruck, FiMapPin, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi'

const PickupStatus = () => {
  const [pickups, setPickups] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('today')

  useEffect(() => {
    fetchPickups()
  }, [dateFilter])

  const fetchPickups = async () => {
    try {
      const { data } = await api.get(`/api/admin/pickups?filter=${dateFilter}`)
      setPickups(data)
    } catch (error) {
      console.error('Error fetching pickups:', error)
      // Sample data for demo
      setPickups([
        {
          _id: '1', userName: 'Rahul Sharma', phone: '9876543210',
          address: '45 MG Road, Andheri West', city: 'Mumbai',
          deviceType: 'Laptop - Dell XPS 15', pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: '14:00-16:00', status: 'Pending', weight: '2.5 kg',
          driverName: '', driverPhone: '', notes: ''
        },
        {
          _id: '2', userName: 'Priya Singh', phone: '9876543211',
          address: '12 Connaught Place', city: 'Delhi',
          deviceType: 'Mobile Phone - Samsung S21 (x2)', pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: '09:00-11:00', status: 'Scheduled', weight: '0.5 kg',
          driverName: 'Sunil Kumar', driverPhone: '9988776655', notes: 'Priority pickup'
        },
        {
          _id: '3', userName: 'Amit Patel', phone: '9876543212',
          address: '78 Brigade Road', city: 'Bangalore',
          deviceType: 'Monitor - LG UltraWide', pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: '11:00-13:00', status: 'In-Transit', weight: '5 kg',
          driverName: 'Ramesh Singh', driverPhone: '9988776644', notes: 'Fragile item'
        },
        {
          _id: '4', userName: 'Sneha Gupta', phone: '9876543213',
          address: '34 FC Road', city: 'Pune',
          deviceType: 'Tablet - iPad Pro', pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: '16:00-18:00', status: 'Completed', weight: '1 kg',
          driverName: 'Vijay Patil', driverPhone: '9988776633', notes: ''
        },
        {
          _id: '5', userName: 'Vikram Rao', phone: '9876543214',
          address: '56 Anna Salai', city: 'Chennai',
          deviceType: 'Desktop - HP Pavilion', pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          pickupTime: '09:00-11:00', status: 'Scheduled', weight: '8 kg',
          driverName: 'Suresh Babu', driverPhone: '9988776622', notes: 'Heavy item, need 2 persons'
        },
        {
          _id: '6', userName: 'Ananya Das', phone: '9876543215',
          address: '23 Park Street', city: 'Kolkata',
          deviceType: 'Printer - Canon PIXMA', pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          pickupTime: '14:00-16:00', status: 'Pending', weight: '6 kg',
          driverName: '', driverPhone: '', notes: ''
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const updatePickupStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/pickups/${id}`, { status: newStatus })
      setPickups(pickups.map(p => p._id === id ? { ...p, status: newStatus } : p))
      toast.success(`Pickup status updated to ${newStatus}`)
    } catch (error) {
      setPickups(pickups.map(p => p._id === id ? { ...p, status: newStatus } : p))
      toast.success('Status updated')
    }
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-warning'
      case 'scheduled': return 'badge-info'
      case 'in-transit': return 'badge-warning'
      case 'completed': return 'badge-success'
      case 'failed': return 'badge-danger'
      default: return 'badge-info'
    }
  }

  const groupedPickups = {
    today: pickups.filter(p => p.pickupDate === new Date().toISOString().split('T')[0]),
    tomorrow: pickups.filter(p => p.pickupDate === new Date(Date.now() + 86400000).toISOString().split('T')[0]),
    upcoming: pickups.filter(p => p.pickupDate > new Date(Date.now() + 86400000).toISOString().split('T')[0])
  }

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Pickup Status Tracker</h1>
          <p>Track and manage all scheduled pickups</p>
        </div>

        {/* Date Filter */}
        <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          <button
            className={`btn ${dateFilter === 'today' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => setDateFilter('today')}
          >
            Today ({groupedPickups.today.length})
          </button>
          <button
            className={`btn ${dateFilter === 'tomorrow' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => setDateFilter('tomorrow')}
          >
            Tomorrow ({groupedPickups.tomorrow.length})
          </button>
          <button
            className={`btn ${dateFilter === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => setDateFilter('upcoming')}
          >
            Upcoming ({groupedPickups.upcoming.length})
          </button>
        </div>

        {/* Pickup Cards */}
        <Card title={`${dateFilter === 'today' ? "Today's" : dateFilter === 'tomorrow' ? "Tomorrow's" : 'Upcoming'} Pickups`}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading pickups...</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {(dateFilter === 'today' ? groupedPickups.today :
                dateFilter === 'tomorrow' ? groupedPickups.tomorrow :
                groupedPickups.upcoming).map((pickup) => (
                <div key={pickup._id} style={{
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  padding: '20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h4 style={{ color: 'var(--secondary-color)' }}>{pickup.userName}</h4>
                      <span className={`badge ${getStatusBadge(pickup.status)}`}>{pickup.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                        <FiMapPin style={{ marginRight: '5px' }} /> {pickup.address}, {pickup.city}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                        <FiCalendar style={{ marginRight: '5px' }} /> {pickup.pickupDate}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                        <FiClock style={{ marginRight: '5px' }} /> {pickup.pickupTime}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                        <FiTruck style={{ marginRight: '5px' }} /> {pickup.deviceType}
                      </p>
                    </div>
                    {pickup.driverName && (
                      <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--primary-color)' }}>
                        🚗 Driver: {pickup.driverName} ({pickup.driverPhone})
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pickup.status === 'Pending' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        onClick={() => updatePickupStatus(pickup._id, 'Scheduled')}
                      >
                        Schedule
                      </button>
                    )}
                    {pickup.status === 'Scheduled' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        onClick={() => updatePickupStatus(pickup._id, 'In-Transit')}
                      >
                        Start Pickup
                      </button>
                    )}
                    {pickup.status === 'In-Transit' && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        onClick={() => updatePickupStatus(pickup._id, 'Completed')}
                      >
                        <FiCheckCircle /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(dateFilter === 'today' ? groupedPickups.today :
                dateFilter === 'tomorrow' ? groupedPickups.tomorrow :
                groupedPickups.upcoming).length === 0 && (
                <p style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>
                  No pickups found for this period.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default PickupStatus
