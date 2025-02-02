"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { API_ROUTES } from "@/config/api"

export function AuthButtons() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", role: "user" })
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Iniciando proceso de login...")
      const response = await fetch(API_ROUTES.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      console.log("Respuesta del servidor:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Inicio de sesión fallido")
      }

      const data = await response.json()
      console.log("Datos recibidos del servidor:", data)

      const { token, user } = data
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)

      console.log("Llamando a la función login del contexto...")
      await login(loginData.email, loginData.password)

      console.log("Login completado, cerrando diálogo...")
      setIsLoginOpen(false)

      console.log("Redirigiendo a:", user.role === "administrator" ? "/admin-dashboard" : "/user-dashboard")
      router.push(user.role === "administrator" ? "/admin-dashboard" : "/user-dashboard")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      toast.error(error.message || "Error en el inicio de sesión")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(API_ROUTES.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        throw new Error("Registro fallido")
      }

      toast.success("Registro exitoso")
      setIsRegisterOpen(false)
      setIsLoginOpen(true)
    } catch (error) {
      toast.error("Error en el registro")
    }
  }

  return (
    <div className="flex gap-4">
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Accede</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Sesión</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Iniciar Sesión</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogTrigger asChild>
          <Button>Regístrate</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrarse</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="user">Usuario</option>
                <option value="administrator">Administrador</option>
              </select>
            </div>
            <Button type="submit">Registrarse</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

