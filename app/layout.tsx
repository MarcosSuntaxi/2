import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center">
                <span className="text-red-500 text-2xl font-bold">♥</span>
                <span className="ml-2 text-xl font-semibold">WeddingBooking</span>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

