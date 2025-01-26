"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function NavBar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold">Sistema de Gestión</div>
        <div className="flex items-center gap-4">
          <span>{user?.email}</span>
          <Button variant="secondary" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}

