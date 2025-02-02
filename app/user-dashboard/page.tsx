"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/user-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({ name: data.name, email: data.email, password: "" })
      }
    } catch (error) {
      toast.error("Error al obtener el perfil")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3002/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Perfil actualizado exitosamente")
        fetchUserProfile()
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil")
    }
  }

  if (!profile) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <Button type="submit">Actualizar Perfil</Button>
      </form>
    </div>
  )
}

