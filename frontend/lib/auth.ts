"use client"

export interface User {
  username: string
  role: "admin" | "user"
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("userRole") as "admin" | "user" | null
  if (username && role) return { username, role }
  return null
}

export const isAuthenticated = (): boolean => getCurrentUser() !== null

export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export const logout = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("username")
  localStorage.removeItem("userRole")
  window.location.href = "/"
}

export const requireAuth = (redirectTo = "/login") => {
  if (!isAuthenticated() && typeof window !== "undefined") {
    window.location.href = redirectTo
    return false
  }
  return true
}

export const requireAdmin = (redirectTo = "/") => {
  if (!isAdmin() && typeof window !== "undefined") {
    window.location.href = redirectTo
    return false
  }
  return true
}

