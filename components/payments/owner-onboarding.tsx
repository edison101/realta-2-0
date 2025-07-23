"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building, CheckCircle, ExternalLink } from "lucide-react"

interface OwnerOnboardingProps {
  currentStatus?: {
    hasAccount: boolean
    onboardingComplete: boolean
    chargesEnabled: boolean
    payoutsEnabled: boolean
  }
  onComplete?: () => void
}

export default function OwnerOnboarding({ currentStatus, onComplete }: OwnerOnboardingProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartOnboarding = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe/onboard", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Error creando enlace de configuración")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError("Error iniciando configuración. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Si ya está completamente configurado
  if (currentStatus?.hasAccount && currentStatus?.onboardingComplete && currentStatus?.chargesEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Cuenta Configurada
          </CardTitle>
          <CardDescription>Tu cuenta está lista para recibir pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Pagos habilitados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Retiros habilitados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Verificación completa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Cuenta activa</span>
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                ¡Perfecto! Ya puedes recibir pagos de tus inquilinos de forma automática y segura.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Configurar Cuenta de Pagos
        </CardTitle>
        <CardDescription>
          Configura tu cuenta con Stripe para recibir pagos de tus inquilinos de forma segura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-medium">Información de la cuenta</h4>
              <p className="text-sm text-gray-600">Proporciona información básica sobre tu negocio</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-medium">Verificación de identidad</h4>
              <p className="text-sm text-gray-600">Verifica tu identidad para cumplir con regulaciones</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-medium">Información bancaria</h4>
              <p className="text-sm text-gray-600">Conecta tu cuenta bancaria para recibir pagos</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4">
          <Button onClick={handleStartOnboarding} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando enlace...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Comenzar Configuración
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• El proceso toma aproximadamente 5-10 minutos</p>
          <p>• Tus datos están protegidos con encriptación de nivel bancario</p>
          <p>• Una vez configurado, los pagos se procesan automáticamente</p>
        </div>
      </CardContent>
    </Card>
  )
}
