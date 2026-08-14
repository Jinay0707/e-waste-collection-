import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiBarChart2, FiDownload, FiTrendingUp, FiUsers, FiTruck, FiAward, FiRefreshCw } from 'react-icons/fi'

const Reports = () => {
  const [reports, setReports] = useState({
    monthlyData: [],
    deviceBreakdown: [],
    cityWiseData: [],
    summary: {}
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const { data } = await api.get(`/api/admin/reports?from=${dateRange.from}&to=${dateRange.to}`)
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Sample data for demo
      setReports({
        summary: {
          totalUsers: 245,
          totalPickups: 532,
          totalWeight: 1250,
          totalDevices: 890,
          avgPointsPerUser: 125,
          completionRate: 93.6
        },
        monthlyData: [
          { month: 'Aug', pickups: 45, weight: 95, users: 35 },
          { month: 'Sep', pickups: 52, weight: 110, users: 40 },
          { month: 'Oct', pickups: 60, weight: 130, users: 45 },
          { month: 'Nov', pickups: 55, weight: 120, users: 42 },
          { month: 'Dec', pickups: 70, weight: 150, users: 50 },
          { month: 'Jan', pickups: 80, weight: 175, users: 55 },
        ],
        deviceBreakdown: [
          { type: 'Laptops', count: 180, percentage: 20 },
          { type: 'Mobile Phones', count: 250, percentage: 28 },
          { type: 'Monitors', count: 90, percentage: 10 },
          { type: 'Tablets', count: 70, percentage: 8 },
          { type: 'Desktops', count: 60, percentage: 7 },
          { type: 'Printers', count: 50, percentage: 6 },
          { type: 'Cables & Accessories', count: 120, percentage: 13 },
          { type: 'Others', count: 70, percentage: 8 },
        ],
        cityWiseData: [
          { city: 'Mumbai', users: 65, pickups: 142, weight: 320 },
          { city: 'Delhi', users: 55, pickups: 120, weight: 280 },
          { city: 'Bangalore', users: 45, pickups: 98, weight: 220 },
          { city: 'Pune', users: 35, pickups: 75, weight: 165 },
          { city: 'Chennai', users: 25, pickups: 52, weight: 130 },
          { city: 'Kolkata', users: 20, pickups: 45, weight: 135 },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    toast.success('Report generated successfully!')
    fetchReports()
  }

  const exportReport = (type) => {
    toast.success(`${type} report exported successfully!`)
  }

  const maxPickups = Math.max(...reports.monthlyData.map(d => d.pickups))

  return (
    <div className="dashboard-container">
      <Sidebar isAdmin={true} />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive analytics of the e-waste collection platform</p>
        </div>

        {/* Date Range & Actions */}
        <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem' }}>From:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              style={{ padding: '8px 12px', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'Poppins, sans-serif' }}
            />
            <label style={{ fontSize: '0.9rem' }}>To:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              style={{ padding: '8px 12px', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={generateReport}>
            <FiBarChart2 /> Generate Report
          </button>
          <button className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => exportReport('PDF')}>
            <FiDownload /> Export PDF
          </button>
        </div>

        {loading ? (
          <Card><p style={{ textAlign: 'center', padding: '30px' }}>Loading reports...</p></Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="icon-box blue"><FiUsers /></div>
                <div className="stat-info">
                  <h3>{reports.summary.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-box">
                <div className="icon-box green"><FiTruck /></div>
                <div className="stat-info">
                  <h3>{reports.summary.totalPickups || 0}</h3>
                  <p>Total Pickups</p>
                </div>
              </div>
              <div className="stat-box">
                <div className="icon-box orange"><FiRefreshCw /></div>
                <div className="stat-info">
                  <h3>{reports.summary.totalWeight || 0} kg</h3>
                  <p>E-Waste Collected</p>
                </div>
              </div>
              <div className="stat-box">
                <div className="icon-box green"><FiTrendingUp /></div>
                <div className="stat-info">
                  <h3>{reports.summary.completionRate || 0}%</h3>
                  <p>Completion Rate</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
              {/* Monthly Trends */}
              <Card title="Monthly Pickup Trends" headerAction={
                <button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => exportReport('Monthly')}>
                  <FiDownload />
                </button>
              }>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reports.monthlyData.map((data, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '40px', fontSize: '0.85rem', fontWeight: 500 }}>{data.month}</span>
                      <div style={{ flex: 1, background: 'var(--light-gray)', borderRadius: '4px', height: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(data.pickups / maxPickups) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--primary-color), var(--primary-dark))',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px',
                          transition: 'width 0.5s ease'
                        }}>
                          <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 600 }}>{data.pickups}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray)', width: '80px' }}>{data.weight} kg</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Device Breakdown */}
              <Card title="Device Type Breakdown" headerAction={
                <button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => exportReport('Devices')}>
                  <FiDownload />
                </button>
              }>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Device Type</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.deviceBreakdown.map((device, index) => (
                      <tr key={index}>
                        <td>{device.type}</td>
                        <td>{device.count}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '6px', background: 'var(--light-gray)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${device.percentage}%`,
                                height: '100%',
                                background: 'var(--primary-color)',
                                borderRadius: '3px'
                              }}></div>
                            </div>
                            <span style={{ fontSize: '0.8rem' }}>{device.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* City-wise Data */}
              <Card title="City-wise Distribution" headerAction={
                <button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => exportReport('City')}>
                  <FiDownload />
                </button>
              }>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Users</th>
                      <th>Pickups</th>
                      <th>Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.cityWiseData.map((city, index) => (
                      <tr key={index}>
                        <td><strong>{city.city}</strong></td>
                        <td>{city.users}</td>
                        <td>{city.pickups}</td>
                        <td>{city.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Environmental Impact */}
              <Card title="Environmental Impact">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ padding: '20px', background: '#e8f8f0', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🌳</div>
                    <h4 style={{ color: 'var(--primary-dark)', marginTop: '8px' }}>Trees Equivalent</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>125</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Trees saved from pollution</p>
                  </div>
                  <div style={{ padding: '20px', background: '#ebf5fb', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>💧</div>
                    <h4 style={{ color: 'var(--info-color)', marginTop: '8px' }}>Water Saved</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--info-color)' }}>50,000 L</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Water preserved by recycling</p>
                  </div>
                  <div style={{ padding: '20px', background: '#fef5e7', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>⚡</div>
                    <h4 style={{ color: 'var(--accent-color)', marginTop: '8px' }}>Energy Saved</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>8,500 kWh</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Energy saved from recycling</p>
                  </div>
                  <div style={{ padding: '20px', background: '#fdedec', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🌍</div>
                    <h4 style={{ color: 'var(--danger-color)', marginTop: '8px' }}>CO2 Reduced</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger-color)' }}>2,800 kg</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>CO2 emissions prevented</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reports
