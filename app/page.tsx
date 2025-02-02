"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { AuthButtons } from "@/components/auth-buttons"

export default function HomePage() {
  const { isAuthenticated, isLoading, userRole } = useAuthStatus()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (userRole === "administrador") {
        router.push("/admin-dashboard")
      } else {
        router.push("/user-dashboard")
      }
    }
  }, [isAuthenticated, isLoading, userRole, router])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6">Web de Boda</h1>
        <p className="text-center text-gray-600 mb-8">
          Crea gratis una web para tu boda totalmente personalizada y en pocos pasos y comparte los detalles del gran
          día con tus invitados.
        </p>
        {!isAuthenticated && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Accede o Regístrate</h2>
            <AuthButtons />
          </div>
        )}
      </div>
    </div>
  )
}

