'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getUser, register as apiRegister } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      const currentUser = getUser(token); // Pass the token to getUser
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [])

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password)
    if (data && data.access_token) {
      const currentUser = getUser(data.access_token)
      setUser(currentUser)
    } else {
      setUser(null);
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  const register = async (username: string, email: string, password: string) => {
    await apiRegister(username, email, password);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, register }}>
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
