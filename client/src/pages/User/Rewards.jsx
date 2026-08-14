import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiAward, FiGift, FiStar, FiShoppingBag, FiCheckCircle, FiCheck, FiFilter } from 'react-icons/fi'

const Rewards = () => {
  const [points, setPoints] = useState(350)
  const [totalRecycled, setTotalRecycled] = useState(8)
  const [tier, setTier] = useState('Silver')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedReward, setSelectedReward] = useState(null)
  const [redeemedCoupon, setRedeemedCoupon] = useState(null)
  const [loading, setLoading] = useState(false)

  const availableRewardsList = [
    {
      _id: '1',
      title: 'Amazon ₹500 Gift Voucher',
      description: 'Get ₹500 digital shopping code valid across all Amazon categories',
      pointsRequired: 300,
      icon: '🎁',
      category: 'Gift Cards',
      code: 'AMZ-ECO-98421'
    },
    {
      _id: '2',
      title: 'Plant a Tree in Your Name',
      description: 'We partner with SankalpTaru to plant a tree with digital geo-tracking certificate',
      pointsRequired: 150,
      icon: '🌳',
      category: 'Eco Impact',
      code: 'TREE-CERT-5091'
    },
    {
      _id: '3',
      title: '15% Off Green Electronics',
      description: 'Exclusive 15% discount coupon on certified refurbished tech products',
      pointsRequired: 100,
      icon: '🎟️',
      category: 'Discounts',
      code: 'ECOTECH-15OFF'
    },
    {
      _id: '4',
      title: 'Master Recycler Gold Badge',
      description: 'Verified digital badge displayed on your profile and leaderboards',
      pointsRequired: 50,
      icon: '🌟',
      category: 'Achievements',
      code: 'BADGE-GOLD-RECYCLER'
    },
    {
      _id: '5',
      title: 'Priority Express Pickup Slot',
      description: 'Book instant same-day doorstep pickup without standard waiting slot',
      pointsRequired: 120,
      icon: '🚛',
      category: 'Services',
      code: 'EXPRESS-PICKUP-FREE'
    },
    {
      _id: '6',
      title: 'Flipkart ₹250 E-Voucher',
      description: 'Voucher code for instant checkout discount on Flipkart electronics',
      pointsRequired: 200,
      icon: '🛍️',
      category: 'Gift Cards',
      code: 'FK-ECO-250-WIN'
    }
  ]

  const categories = ['All', 'Gift Cards', 'Discounts', 'Eco Impact', 'Achievements', 'Services']

  const getTierColor = (tierName) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return '#cd7f32'
      case 'silver': return '#94a3b8'
      case 'gold': return '#f59e0b'
      case 'platinum': return '#6366f1'
      default: return 'var(--primary-color)'
    }
  }

  const handleRedeemClick = (reward) => {
    if (points < reward.pointsRequired) {
      toast.error(`You need ${reward.pointsRequired - points} more points to redeem this item.`)
      return
    }
    setSelectedReward(reward)
  }

  const confirmRedemption = () => {
    if (!selectedReward) return
    setPoints(prev => prev - selectedReward.pointsRequired)
    setRedeemedCoupon({
      title: selectedReward.title,
      code: selectedReward.code,
      pointsSpent: selectedReward.pointsRequired
    })
    setSelectedReward(null)
    toast.success(`🎉 Congratulations! Successfully redeemed "${selectedReward.title}"!`)
  }

  const filteredRewards = activeCategory === 'All'
    ? availableRewardsList
    : availableRewardsList.filter(r => r.category === activeCategory)

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="page-header">
          <h1>Green Rewards Marketplace 🎁</h1>
          <p>Redeem your earned eco points for gift vouchers, eco-impact trees, and exclusive discounts</p>
        </div>

        {/* Stats & Points Summary Grid */}
        <div className="stats-grid mb-3">
          <div className="stat-box glass-card">
            <div className="icon-box green">
              <FiAward />
            </div>
            <div className="stat-info">
              <h3>{points} pts</h3>
              <p>Available Balance</p>
            </div>
          </div>
          <div className="stat-box glass-card">
            <div className="icon-box blue">
              <FiStar />
            </div>
            <div className="stat-info">
              <h3>{totalRecycled} Devices</h3>
              <p>Total Items Recycled</p>
            </div>
          </div>
          <div className="stat-box glass-card">
            <div className="icon-box orange">
              <FiAward />
            </div>
            <div className="stat-info">
              <h3 style={{ color: getTierColor(tier) }}>{tier} Level</h3>
              <p>Tier Status Badge</p>
            </div>
          </div>
        </div>

        {/* Tier Level Progress Bar */}
        <div className="card glass-card mb-3">
          <div className="card-header">
            <h3><FiStar /> Eco Recycler Level Progress</h3>
            <span style={{ fontWeight: 700, color: getTierColor(tier) }}>Current: {tier} Tier</span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-gray)' }}>
                Progress to Gold Tier (500 pts)
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: 700 }}>
                {500 - points > 0 ? `${500 - points} points to Gold Tier` : '🌟 Gold Tier Achieved!'}
              </span>
            </div>
            <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((points / 500) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '6px',
                transition: 'width 0.6s ease'
              }}></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
              <strong>Bronze Tier:</strong> 0 - 150 pts
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <strong>Silver Tier:</strong> 150 - 500 pts (Active)
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
              <strong>Gold Tier:</strong> 500 - 1000 pts (+15% Bonus Pts)
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Available Rewards Grid */}
        <div className="card glass-card">
          <div className="card-header">
            <h3><FiShoppingBag /> Available Rewards ({filteredRewards.length})</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
              Click Redeem to claim instant digital voucher
            </span>
          </div>

          <div className="rewards-grid">
            {filteredRewards.map((reward) => {
              const canRedeem = points >= reward.pointsRequired

              return (
                <div className="reward-card" key={reward._id}>
                  <div className="reward-icon" style={{
                    background: canRedeem ? '#ecfdf5' : '#fef2f2',
                    fontSize: '2rem'
                  }}>
                    {reward.icon}
                  </div>
                  <h3>{reward.title}</h3>
                  <p>{reward.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <span className="reward-points">⭐ {reward.pointsRequired} pts</span>
                    <button
                      className={`btn ${canRedeem ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: '20px' }}
                      onClick={() => handleRedeemClick(reward)}
                      disabled={!canRedeem}
                    >
                      {canRedeem ? 'Redeem Voucher' : 'Need More Pts'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Confirmation Modal */}
        {selectedReward && (
          <div className="modal-overlay" onClick={() => setSelectedReward(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{selectedReward.icon}</div>
              <h2 style={{ color: 'var(--secondary-color)' }}>Redeem "{selectedReward.title}"?</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)', margin: '10px 0 20px 0' }}>
                This will deduct <strong>⭐ {selectedReward.pointsRequired} Green Points</strong> from your wallet balance.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={() => setSelectedReward(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={confirmRedemption}
                >
                  Confirm & Unlock Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Redeemed Voucher Success Modal */}
        {redeemedCoupon && (
          <div className="modal-overlay" onClick={() => setRedeemedCoupon(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ color: 'var(--secondary-color)' }}>Voucher Unlocked Successfully!</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', margin: '6px 0 20px 0' }}>
                {redeemedCoupon.title}
              </p>

              <div style={{ background: '#ecfdf5', border: '2px dashed #10b981', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>YOUR PROMO / COUPON CODE</span>
                <h3 style={{ fontSize: '1.4rem', letterSpacing: '2px', color: '#047857', marginTop: '4px' }}>
                  {redeemedCoupon.code}
                </h3>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setRedeemedCoupon(null)}
              >
                Done & Save Voucher
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Rewards

