import { Link } from "react-router-dom";
import { FiTruck, FiAward, FiShield, FiTrendingUp, FiGlobe, FiSmile, FiArrowRight } from "react-icons/fi";

function Home() {
  return (
    <>
      {/* Glassmorphism Hero Section */}
      <section className="hero glass-hero">
        <div className="hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#059669',
            marginBottom: '16px'
          }}>
            🌱 Eco-Friendly Recycling Platform & Rewards
          </div>

          <h1>
            Give Your E-Waste a
            <span> Better & Greener Future</span>
          </h1>

          <p>
            Dispose of your electronic devices safely, protect the planet from toxic waste, and earn exciting green reward points for every item recycled!
          </p>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
            <Link to="/pickup-request" className="hero-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FiTruck /> Schedule Pickup Now <FiArrowRight />
            </Link>
            <Link to="/rewards" className="btn btn-outline" style={{ padding: '14px 24px', fontSize: '1rem', background: 'white' }}>
              <FiAward /> Explore Rewards
            </Link>
          </div>
        </div>

        <div className="hero-image" style={{ animation: 'floatAnim 4s ease-in-out infinite', textShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}>
          ♻️
        </div>
      </section>

      {/* Live Eco Impact Banner */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 40px auto', padding: '0 20px', position: 'relative', zIndex: '10' }}>
        <div className="eco-impact-banner">
          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiGlobe />
            </div>
            <div className="impact-info">
              <h4>12,450+ kg</h4>
              <p>Total E-Waste Recycled</p>
            </div>
          </div>

          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiTrendingUp />
            </div>
            <div className="impact-info">
              <h4>28.5 Tons</h4>
              <p>CO₂ Emissions Prevented</p>
            </div>
          </div>

          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiAward />
            </div>
            <div className="impact-info">
              <h4>45,000+</h4>
              <p>Green Points Awarded</p>
            </div>
          </div>

          <div className="impact-item">
            <div className="impact-icon-wrapper">
              <FiSmile />
            </div>
            <div className="impact-info">
              <h4>3,800+</h4>
              <p>Happy Recyclers</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="features">
        <h2>How E-Waste Collection Works</h2>
        <p style={{ color: 'var(--gray)', maxWidth: '600px', margin: '-25px auto 40px auto' }}>
          Recycling your old electronics is quick, transparent, and rewarding in just 4 simple steps.
        </p>

        <div className="feature-container">
          <div className="feature-card glass-card">
            <div className="icon">📱</div>
            <h3>1. Select Devices</h3>
            <p>Choose your e-waste items (laptops, phones, appliances) & calculate instant reward points.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="icon">📅</div>
            <h3>2. Book Pickup</h3>
            <p>Pick a date, convenient time slot, and location for door-step collection.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="icon">🚚</div>
            <h3>3. Doorstep Pickup</h3>
            <p>Our verified eco-agents collect your items with instant verification.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="icon">🎁</div>
            <h3>4. Earn Green Rewards</h3>
            <p>Receive reward points directly in your account and redeem vouchers or badges.</p>
          </div>
        </div>
      </section>

      {/* E-Waste We Collect with Points Badge */}
      <section className="categories" style={{ background: 'white' }}>
        <h2>E-Waste We Collect & Points Value</h2>
        <p style={{ color: 'var(--gray)', maxWidth: '600px', margin: '-25px auto 40px auto' }}>
          Every item you recycle saves hazardous materials from landfills and earns you points!
        </p>

        <div className="category-container">
          <div className="category-card glass-card" style={{ padding: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
              +50 pts
            </span>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>💻</div>
            <h3>Laptops & Desktops</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '6px' }}>Computers, MacBooks, Workstations</p>
          </div>

          <div className="category-card glass-card" style={{ padding: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
              +30 pts
            </span>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>📱</div>
            <h3>Mobile & Tablets</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '6px' }}>Smartphones, iPads, Feature Phones</p>
          </div>

          <div className="category-card glass-card" style={{ padding: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
              +40 pts
            </span>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🖥️</div>
            <h3>Monitors & TVs</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '6px' }}>LED, LCD Displays, Smart TVs</p>
          </div>

          <div className="category-card glass-card" style={{ padding: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
              +25 pts
            </span>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🖨️</div>
            <h3>Printers & Scanners</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '6px' }}>InkJet, Laser Printers, Copiers</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;