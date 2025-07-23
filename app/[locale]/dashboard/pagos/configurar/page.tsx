"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import OwnerOnboarding from "@/components/payments/owner-onboarding"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Building, CreditCard } from "lucide-react"

interface StripeAccount {
  id: string
  stripe_account_id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  country: string
}

export default function PaymentSetupPage() {
  const searchParams = useSearchParams()
  const [account, setAccount] = useState<StripeAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const success = searchParams.get("success")
  const refresh = searchParams.get("refresh")

  useEffect(() => {
    fetchAccountStatus()
  }, [])

  const fetchAccountStatus = async () => {
    try {
      const response = await fetch("/api/stripe/account-status")
      if (response.ok) {
        const data = await response.json()
        setAccount(data.account)
      }
    } catch (error) {
      console.error("Error fetching account status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración de Pagos</h1>
          <p className="text-gray-600">Configura tu cuenta para recibir pagos de tus inquilinos</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              ¡Configuración completada exitosamente! Ya puedes recibir pagos.
            </AlertDescription>
          </Alert>
        )}

        {refresh && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Hubo un problema con la configuración. Por favor, inténtalo de nuevo.</AlertDescription>
          </Alert>
        )}

        {!account ? (
          <OwnerOnboarding />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Estado de tu Cuenta
              </CardTitle>
              <CardDescription>Información sobre tu cuenta de Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {account.charges_enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">{account.charges_enabled ? "Pagos habilitados" : "Pagos pendientes"}</span>
                </div>

                <div className="flex items-center gap-3">
                  {account.payouts_enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {account.payouts_enabled ? "Retiros habilitados" : "Retiros pendientes"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {account.details_submitted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {account.details_submitted ? "Información completa" : "Información pendiente"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">País: {account.country}</span>
                </div>
              </div>

              {!account.charges_enabled || !account.payouts_enabled || !account.details_submitted ? (
                <Alert>
                  <AlertDescription>
                    Tu cuenta aún necesita configuración adicional.
                    <a
                      href={`https://dashboard.stripe.com/connect/accounts/${account.stripe_account_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Completar en Stripe →
                    </a>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ¡Tu cuenta está completamente configurada! Ya puedes recibir pagos de tus inquilinos.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
