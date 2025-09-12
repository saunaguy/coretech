'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getUser } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const login = async (username: string, password: string) => {
    await apiLogin(username, password)
    const currentUser = getUser()
    setUser(currentUser)
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
