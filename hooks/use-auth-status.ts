"use client"

import { useState, useEffect } from "react"

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("userRole")
      if (token) {
        try {
          const response = await fetch("http://localhost:4000/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            setIsAuthenticated(true)
            setUserRole(role)
          } else {
            localStorage.removeItem("token")
            localStorage.removeItem("userRole")
          }
        } catch (error) {
          console.error("Error validating token:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("userRole")
        }
      }
      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  return { isAuthenticated, isLoading, userRole }
}

