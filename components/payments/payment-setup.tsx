"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Calendar } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentSetupProps {
  contractId: string
  amount: number
  currency: string
  type: "deposit" | "rent"
  onSuccess?: () => void
}

function PaymentForm({ contractId, amount, currency, type, onSuccess }: PaymentSetupProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (type === "deposit") {
        // Pago único para depósito
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractId,
            amount,
            currency,
            type,
          }),
        })

        const { clientSecret } = await response.json()

        const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        })

        if (stripeError) {
          setError(stripeError.message || "Error procesando el pago")
        } else {
          setSuccess(true)
          onSuccess?.()
        }
      } else {
        // Suscripción para pagos mensuales
        const response = await fetch("/api/stripe/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractId,
            amount,
            currency,
          }),
        })

        const { clientSecret } = await response.json()

        const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        })

        if (stripeError) {
          setError(stripeError.message || "Error configurando los pagos")
        } else {
          setSuccess(true)
          onSuccess?.()
        }
      }
    } catch (err) {
      setError("Error procesando la solicitud")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              {type === "deposit" ? "¡Depósito Pagado!" : "¡Pagos Configurados!"}
            </h3>
            <p className="text-gray-600">
              {type === "deposit"
                ? "Tu depósito ha sido procesado exitosamente."
                : "Tus pagos mensuales están configurados y se procesarán automáticamente."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === "deposit" ? <CreditCard className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          {type === "deposit" ? "Pagar Depósito" : "Configurar Pagos Mensuales"}
        </CardTitle>
        <CardDescription>
          {type === "deposit"
            ? `Paga tu depósito de seguridad de ${currency.toUpperCase()} ${amount.toFixed(2)}`
            : `Configura pagos automáticos de ${currency.toUpperCase()} ${amount.toFixed(2)}/mes`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!stripe || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : type === "deposit" ? (
              `Pagar ${currency.toUpperCase()} ${amount.toFixed(2)}`
            ) : (
              "Configurar Pagos Automáticos"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Tus datos están protegidos con encriptación SSL de 256 bits
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default function PaymentSetup(props: PaymentSetupProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
