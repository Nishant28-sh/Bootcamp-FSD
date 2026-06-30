import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8888/pages'

// ── SVG Icons ─────────────────────────────────────────────
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function Dashboard({ user, onLogout }) {
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setDashData(res.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setDashData({ msg: 'Welcome to your Dashboard!' })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U'

  const stats = [
    { label: 'Status', value: 'Active', icon: <IconCheck />, color: 'var(--success)' },
    { label: 'Auth Method', value: 'JWT', icon: <IconShield />, color: 'var(--accent-bright)' },
    { label: 'Session', value: '7 days', icon: <IconClock />, color: 'var(--warning)' },
  ]

  return (
    <div className="page">
      <div className="dashboard-card">

        {/* Avatar */}
        <div className="avatar">
          {user?.name ? getInitial(user.name) : 'U'}
        </div>

        <h2>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h2>
        <p>You are securely authenticated to your account.</p>

        {/* Email pill */}
        {user?.email && (
          <div className="info-pill">
            <IconMail />
            {user.email}
          </div>
        )}

        {/* Dashboard API data */}
        {loading ? (
          <div className="api-response-box" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="spinner" style={{ borderTopColor: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading dashboard data...</span>
          </div>
        ) : (
          <div className="api-response-box">
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              API Response
            </p>
            <p style={{ color: 'var(--accent-bright)', fontSize: 14, fontWeight: 500 }}>
              {dashData?.msg || 'Dashboard loaded successfully'}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="stats-row">
          {stats.map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <button className="btn-outline" onClick={onLogout}>
          <IconLogout />
          Sign Out
        </button>
      </div>
    </div>
  )
}
