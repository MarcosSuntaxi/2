"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_ROUTES } from "@/config/api"

interface User {
  id: number
  username: string
  email: string
  role: "administrator" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      validateToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(API_ROUTES.GET_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
      }
    } catch (error) {
      console.error("Error validating token:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Iniciando login en el contexto...")
      const response = await fetch(API_ROUTES.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Respuesta del servidor (contexto):", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const { token, user } = await response.json()
      console.log("Datos del usuario recibidos:", user)

      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)
      setUser(user)

      console.log("Usuario establecido en el contexto:", user)
      console.log(
        "Redirigiendo desde el contexto a:",
        user.role === "administrator" ? "/admin-dashboard" : "/user-dashboard",
      )

      // Usamos setTimeout para asegurarnos de que la redirección ocurra después de que React haya actualizado el estado
      setTimeout(() => {
        if (user.role === "administrator") {
          router.push("/admin-dashboard")
        } else {
          router.push("/user-dashboard")
        }
      }, 0)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

