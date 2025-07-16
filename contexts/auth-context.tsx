"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  accountType: "lawyer" | "client" | "admin"
  barNumber?: string
  specialization?: string
  yearsOfExperience?: number
  phone?: string
  company?: string
  address?: string
  isEmailVerified?: boolean
  twoFactorEnabled?: boolean
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  refreshSession: () => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  password: string
  accountType: "lawyer" | "client"
  barNumber?: string
  specialization?: string
  yearsOfExperience?: number
  company?: string
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock users database
  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Lawyer",
      email: "lawyer@example.com",
      accountType: "lawyer",
      barNumber: "BAR123456",
      specialization: "Corporate Law",
      yearsOfExperience: 5,
      isEmailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Jane Client",
      email: "client@example.com",
      accountType: "client",
      phone: "+1-555-0123",
      isEmailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Demo User",
      email: "user@example.com",
      accountType: "lawyer",
      isEmailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("currentUser")

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
      localStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
    } finally {
      setLoading(false)
    }
  }

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }> => {
    try {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock database
      let foundUser = mockUsers.find((u) => u.email === email)

      // Check demo credentials
      if (!foundUser && email === "user@example.com" && password === "password") {
        foundUser = mockUsers[2] // Demo user
      }

      // Validate password (in real app, this would be hashed)
      if (foundUser && (password === "password123" || password === "password")) {
        // Generate mock JWT token
        const token = generateMockToken(foundUser.id, rememberMe ? "30d" : "1d")

        // Update user state
        setUser(foundUser)
        localStorage.setItem("authToken", token)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }

        return { success: true }
      } else {
        return { success: false, error: "Invalid email or password" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: "Email already in use" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        accountType: userData.accountType,
        barNumber: userData.barNumber,
        specialization: userData.specialization,
        yearsOfExperience: userData.yearsOfExperience,
        phone: userData.phone,
        company: userData.company,
        address: userData.address,
        isEmailVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      }

      // Add to mock database
      mockUsers.push(newUser)

      // Auto-login after registration
      const token = generateMockToken(newUser.id, "1d")
      setUser(newUser)
      localStorage.setItem("authToken", token)
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "An error occurred during registration" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("rememberMe")
  }

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      return true
    } catch (error) {
      console.error("Update user error:", error)
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would send a reset email
      console.log(`Password reset email sent to ${email}`)

      return true
    } catch (error) {
      console.error("Reset password error:", error)
      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would verify current password and update
      return true
    } catch (error) {
      console.error("Change password error:", error)
      return false
    }
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (user) {
        const updatedUser = { ...user, isEmailVerified: true }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }

      return true
    } catch (error) {
      console.error("Email verification error:", error)
      return false
    }
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token || !user) return false

      // Generate new token
      const newToken = generateMockToken(user.id, "1d")
      localStorage.setItem("authToken", newToken)

      return true
    } catch (error) {
      console.error("Session refresh error:", error)
      return false
    }
  }

  const generateMockToken = (userId: string, expiresIn: string): string => {
    const header = { alg: "HS256", typ: "JWT" }
    const now = Math.floor(Date.now() / 1000)
    const exp = expiresIn === "30d" ? now + 30 * 24 * 60 * 60 : now + 24 * 60 * 60

    const payload = {
      sub: userId,
      iat: now,
      exp: exp,
    }

    // This is a mock token - in production, use proper JWT library
    return btoa(JSON.stringify(header)) + "." + btoa(JSON.stringify(payload)) + ".mock_signature"
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
    changePassword,
    verifyEmail,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
