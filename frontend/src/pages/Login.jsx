import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Navbar from '../components/Navbar/Navbar'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(email, password)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError('Invalid login credentials')
      }
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <Navbar />
      <div className="container flex items-center justify-center py-16">
        <div className="auth-card glass-card w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
          
          {error && <div className="error-alert mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Sign In"}
            </button>
          </form>
          
          <p className="auth-footer mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-cyan font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
