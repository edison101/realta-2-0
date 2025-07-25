"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Cuentas demo para pruebas
const demoAccounts = [
  {
    email: "propietario@demo.com",
    password: "demo123",
    type: "Propietario",
    name: "María González",
  },
  {
    email: "inquilino@demo.com",
    password: "demo123",
    type: "Inquilino",
    name: "Carlos Mendoza",
  },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simular login
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar si es una cuenta demo
      const demoAccount = demoAccounts.find(
        (account) => account.email === formData.email && account.password === formData.password,
      )

      if (demoAccount) {
        console.log("Login exitoso con cuenta demo:", demoAccount)
        // Guardar información del usuario en localStorage para la demo
        localStorage.setItem("demoUser", JSON.stringify(demoAccount))
        window.location.href = "/dashboard"
      } else {
        // Aquí iría la lógica real de autenticación
        console.log("Intentando login:", formData.email)
        setErrors({ general: "Credenciales incorrectas. Usa las cuentas demo." })
      }
    } catch (error) {
      console.error("Error en login:", error)
      setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: false,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Realta
              </span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-gray-600">Accede a tu cuenta para gestionar tus propiedades</p>
        </div>

        {/* Cuentas demo */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">🚀 Cuentas Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-blue-800 mb-3">Prueba la plataforma con estas cuentas de demostración:</p>
            {demoAccounts.map((account, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-600">{account.type}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account)}
                    className="bg-transparent"
                  >
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceder a tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Recordarme y olvidé contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Recordarme
                  </Label>
                </div>
                <Link href="/recuperar-password" className="text-sm text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Error general */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Botón de login */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">o</span>
          </div>
        </div>

        {/* Botones de redes sociales */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-transparent" disabled>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </Button>

          <Button variant="outline" className="w-full bg-transparent" disabled>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continuar con Facebook
          </Button>
        </div>

        {/* Link a registro */}
        <div className="text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-blue-600 hover:text-blue-800 font-medium">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
