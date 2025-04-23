"use client"

import type React from "react"
import type { User } from "@/types/user"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (userData: Omit<User, "id">) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // In a real app, this would validate the token with the backend
          // const response = await api.get("/api/auth/me")
          // setUser(response.data)

          // For demo purposes, we'll just simulate a logged-in user
          setUser({
            id: "1",
            name: "John Doe",
            username: "johndoe",
            email: "john.doe@example.com",
            phone: "+1234567890",
          })
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // In a real app, this would call the API to login
      // const response = await api.post("/api/auth/token/", { username, password })
      // localStorage.setItem("token", response.data.access)
      // setUser(response.data.user)

      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.setItem("token", "demo-token")
      setUser({
        id: "1",
        name: "John Doe",
        username: "johndoe",
        email: "john.doe@example.com",
        phone: "+1234567890",
      })
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signup = async (userData: Omit<User, "id">) => {
    try {
      // In a real app, this would call the API to register
      // const response = await api.post("/api/auth/signup/", userData)
      // localStorage.setItem("token", response.data.access)
      // setUser(response.data.user)

      // For demo purposes, we'll just simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      localStorage.setItem("token", "demo-token")
      setUser({
        id: "1",
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
      })
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/"
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // In a real app, this would call the API to update the profile
      // const response = await api.patch("/api/auth/me/", userData)
      // setUser(response.data)

      // For demo purposes, we'll just simulate a successful profile update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser((prev) => {
        if (!prev) return null
        return { ...prev, ...userData }
      })
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
