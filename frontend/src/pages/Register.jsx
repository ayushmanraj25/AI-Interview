import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Navbar from '../components/Navbar/Navbar'
import './Login.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await authService.register(email, password)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError('Failed to create account')
      }
    } catch (err) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      <Navbar />
      <div className="container flex items-center justify-center py-16">
        <div className="auth-card glass-card w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
          
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Sign Up"}
            </button>
          </form>
          
          <p className="auth-footer mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-cyan font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
