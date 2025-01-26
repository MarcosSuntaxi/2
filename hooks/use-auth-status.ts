"use client"

import { useState, useEffect } from "react"

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/api/validate-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setIsAuthenticated(response.ok)
        } catch (error) {
          console.error("Error validating token:", error)
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  return { isAuthenticated, isLoading }
}

