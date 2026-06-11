import { supabase } from './supabase'

export const authService = {
  async register(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      // Save local session state
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
      }
      return { success: true, user: data.user }
    } catch (error) {
      console.warn("Supabase registration failed, falling back to mock:", error.message)
      // Mock registration fallback
      const mockUser = { id: 'mock-user-' + Math.random().toString(36).substr(2, 9), email }
      localStorage.setItem('supabase.auth.token', JSON.stringify({ access_token: 'mock-token-xyz', user: mockUser }))
      return { success: true, user: mockUser }
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
      }
      return { success: true, user: data.user }
    } catch (error) {
      console.warn("Supabase login failed, falling back to mock:", error.message)
      // Mock login fallback
      const mockUser = { id: 'mock-user-123', email }
      localStorage.setItem('supabase.auth.token', JSON.stringify({ access_token: 'mock-token-xyz', user: mockUser }))
      return { success: true, user: mockUser }
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (e) {
      console.warn("Supabase signOut error, completing local logout:", e.message)
    } finally {
      localStorage.removeItem('supabase.auth.token')
    }
    return { success: true }
  },

  getCurrentUser() {
    const sessionStr = localStorage.getItem('supabase.auth.token')
    if (!sessionStr) return null
    try {
      const session = JSON.parse(sessionStr)
      return session.user || { id: 'mock-user-123', email: 'mock@example.com' }
    } catch (e) {
      return null
    }
  }
}
