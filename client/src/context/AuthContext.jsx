import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAdmin = localStorage.getItem('isAdmin')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedAdmin) {
      setIsAdmin(JSON.parse(storedAdmin))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAdmin(userData.role === 'admin')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAdmin', JSON.stringify(userData.role === 'admin'))
    localStorage.setItem('token', userData.token)
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('token')
  }

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    setLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
