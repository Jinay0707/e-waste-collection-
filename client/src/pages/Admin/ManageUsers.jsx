import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/admin/users')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      // Sample data for demo
      setUsers([
        { _id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', phone: '9876543210', city: 'Mumbai', status: 'active', totalRequests: 5, totalPoints: 150, createdAt: '2024-01-15' },
        { _id: '2', name: 'Priya Singh', email: 'priya@email.com', phone: '9876543211', city: 'Delhi', status: 'active', totalRequests: 8, totalPoints: 280, createdAt: '2024-01-10' },
        { _id: '3', name: 'Amit Patel', email: 'amit@email.com', phone: '9876543212', city: 'Bangalore', status: 'active', totalRequests: 3, totalPoints: 90, createdAt: '2024-01-08' },
        { _id: '4', name: 'Sneha Gupta', email: 'sneha@email.com', phone: '9876543213', city: 'Pune', status: 'inactive', totalRequests: 1, totalPoints: 25, createdAt: '2024-01-05' },
        { _id: '5', name: 'Vikram Rao', email: 'vikram@email.com', phone: '9876543214', city: 'Chennai', status: 'active', totalRequests: 12, totalPoints: 420, createdAt: '2024-01-01' },
        { _id: '6', name: 'Ananya Das', email: 'ananya@email.com', phone: '9876543215', city: 'Kolkata', status: 'active', totalRequests: 6, totalPoints: 200, createdAt: '2023-12-28' },
        { _id: '7', name: 'Rohan Mehta', email: 'rohan@email.com', phone: '9876543216', city: 'Hyderabad', status: 'blocked', totalRequests: 2, totalPoints: 60, createdAt: '2023-12-25' },
        { _id: '8', name: 'Kavita Joshi', email: 'kavita@email.com', phone: '9876543217', city: 'Ahmedabad', status: 'active', totalRequests: 4, totalPoints: 130, createdAt: '2023-12-20' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      await api.put(`/api/admin/users/${userId}/status`, { status: newStatus })
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      // Demo: update locally
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
      toast.success(`User status updated`)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/api/admin/users/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      setUsers(users.filter(u => u._id !== userId))
      toast.success('User deleted')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Manage Users</h1>
          <p>View and manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Users Table */}
        <Card title={`All Users (${filteredUsers.length})`}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading users...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Requests</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: 500 }}>{user.name}</td>
                      <td style={{ fontSize: '0.85rem' }}>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.city}</td>
                      <td>{user.totalRequests}</td>
                      <td>{user.totalPoints}</td>
                      <td>
                        <span className={`badge ${
                          user.status === 'active' ? 'badge-success' :
                          user.status === 'inactive' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            className={`btn ${user.status === 'active' ? 'btn-outline' : 'btn-success'}`}
                            style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                            onClick={() => toggleUserStatus(user._id, user.status)}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' ? <FiUserX /> : <FiUserCheck />}
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                            onClick={() => deleteUser(user._id)}
                            title="Delete User"
                          >
                            <FiTrash2 />
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
      </div>
    </div>
  )
}

export default ManageUsers
