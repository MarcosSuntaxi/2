"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { AuthButtons } from "@/components/auth-buttons"

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const { isAuthenticated, isLoading } = useAuthStatus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Registro fallido")
      }

      toast.success("Registro exitoso")
    } catch (error) {
      toast.error("Error en el registro")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <AuthButtons />
        </div>
        <h1 className="text-4xl font-bold text-center mb-6">Web de Boda</h1>
        <p className="text-center text-gray-600 mb-8">
          Crea gratis una web para tu boda totalmente personalizada y en pocos pasos y comparte los detalles del gran
          día con tus invitados.
        </p>
        {isLoading && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-center">Cargando...</p>
          </div>
        )}
        {!isAuthenticated && !isLoading && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">REGISTRARME</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="sr-only">
                  Nombre y apellidos
                </Label>
                <Input
                  id="name"
                  placeholder="Nombre y apellidos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Empieza a organizar
              </Button>
            </form>
          </div>
        )}
        {isAuthenticated && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Bienvenido a tu Web de Boda</h2>
            <p className="text-center">Ya estás registrado. ¡Comienza a organizar tu boda!</p>
          </div>
        )}
      </div>
    </div>
  )
}

