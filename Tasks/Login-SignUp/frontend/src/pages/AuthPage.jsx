import { useState } from 'react'
import axios from 'axios'

const API = 'https://bootcamp-fsd-1.onrender.com'

// ── SVG Icons ────────────────────────────────────────────
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
)

const IconEyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconEyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconCheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconXCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// Password strength calculator
function getStrength(password) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
const strengthColors = ['', '#f43f5e', '#f59e0b', '#eab308', '#10b981', '#8b5cf6']

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null) // { type: 'success'|'error', msg }

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const strength = getStrength(signupForm.password)

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleTabSwitch = (t) => {
    setTab(t)
    setAlert(null)
    setShowPassword(false)
    setShowConfirm(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      return showAlert('error', 'Please fill in all fields')
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/login`, loginForm)
      if (res.data.token) {
        showAlert('success', res.data.msg)
        setTimeout(() => onLogin(res.data.token, res.data.user), 800)
      } else {
        showAlert('error', res.data.msg || 'Login failed')
      }
    } catch (err) {
      const msg = err.response?.data?.msg || 'Server error. Make sure backend is running.'
      showAlert('error', msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    const { name, email, password, confirm } = signupForm

    if (!name || !email || !password || !confirm) {
      return showAlert('error', 'Please fill in all fields')
    }
    if (password.length < 6) {
      return showAlert('error', 'Password must be at least 6 characters')
    }
    if (password !== confirm) {
      return showAlert('error', 'Passwords do not match')
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API}/register`, { name, email, password })
      if (res.data.token) {
        showAlert('success', res.data.msg)
        setTimeout(() => onLogin(res.data.token, res.data.user), 800)
      } else {
        showAlert('error', res.data.msg || 'Registration failed')
      }
    } catch (err) {
      const msg = err.response?.data?.msg || 'Server error. Make sure backend is running.'
      showAlert('error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="auth-card">

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">
            <IconShield />
          </div>
          <h1>AuthFlow</h1>
          <p>{tab === 'login' ? 'Sign in to your account' : 'Create your free account'}</p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail /></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} noValidate>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconUser /></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={signupForm.name}
                  onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail /></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={signupForm.email}
                  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={signupForm.password}
                  onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>

              {/* Password strength bar */}
              {signupForm.password.length > 0 && (
                <>
                  <div className="strength-bar">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="strength-segment"
                        style={{
                          background: i <= strength ? strengthColors[strength] : undefined
                        }}
                      />
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </div>
                </>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat password"
                  value={signupForm.confirm}
                  onChange={e => setSignupForm(f => ({ ...f, confirm: e.target.value }))}
                  autoComplete="new-password"
                  style={{
                    borderColor: signupForm.confirm && signupForm.confirm !== signupForm.password
                      ? 'rgba(244,63,94,0.5)' : undefined
                  }}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span className="alert-icon">
              {alert.type === 'success' ? <IconCheckCircle /> : <IconXCircle />}
            </span>
            {alert.msg}
          </div>
        )}

        {/* Footer */}
        <div className="auth-footer">
          {tab === 'login'
            ? <>Don&apos;t have an account? <button className="link-btn" onClick={() => handleTabSwitch('signup')}>Sign up free</button></>
            : <>Already have an account? <button className="link-btn" onClick={() => handleTabSwitch('login')}>Sign in</button></>
          }
        </div>
      </div>
    </div>
  )
}
