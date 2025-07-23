"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PaymentSetup from "@/components/payments/payment-setup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Home, User, DollarSign } from "lucide-react"

interface Contract {
  id: string
  property: {
    title: string
    address: string
    city: string
    country: string
  }
  owner: {
    full_name: string
    email: string
  }
  monthly_rent: number
  deposit_amount: number
  currency: string
  start_date: string
  end_date: string
  status: string
}

interface Payment {
  id: string
  payment_type: string
  amount: number
  status: string
  due_date: string
  paid_at: string | null
}

export default function PaymentPage() {
  const params = useParams()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContractData()
  }, [contractId])

  const fetchContractData = async () => {
    try {
      const [contractRes, paymentsRes] = await Promise.all([
        fetch(`/api/contracts/${contractId}`),
        fetch(`/api/contracts/${contractId}/payments`),
      ])

      if (contractRes.ok) {
        const contractData = await contractRes.json()
        setContract(contractData)
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
      }
    } catch (error) {
      console.error("Error fetching contract data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    fetchContractData()
    // Opcional: mostrar notificación de éxito
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Contrato no encontrado</h1>
          <p className="text-gray-600 mt-2">El contrato que buscas no existe o no tienes acceso a él.</p>
        </div>
      </div>
    )
  }

  const pendingDeposit = payments.find((p) => p.payment_type === "deposit" && p.status === "pending")
  const hasActiveSub = payments.some((p) => p.payment_type === "rent" && p.status === "succeeded")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pagos del Contrato</h1>
          <p className="text-gray-600">Gestiona los pagos de tu contrato de renta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del Contrato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Información del Contrato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{contract.property.title}</h3>
                  <p className="text-sm text-gray-600">
                    {contract.property.address}, {contract.property.city}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Propietario: {contract.owner.full_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(contract.start_date).toLocaleDateString()} -{" "}
                    {new Date(contract.end_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Renta: {contract.currency} {contract.monthly_rent.toFixed(2)}/mes
                  </span>
                </div>

                <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                  {contract.status === "active" ? "Activo" : "Pendiente"}
                </Badge>
              </CardContent>
            </Card>

            {/* Historial de Pagos */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay pagos registrados</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.payment_type === "deposit" ? "Depósito" : "Renta"}</p>
                          <p className="text-sm text-gray-600">
                            {contract.currency} {payment.amount.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            payment.status === "succeeded"
                              ? "default"
                              : payment.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {payment.status === "succeeded"
                            ? "Pagado"
                            : payment.status === "failed"
                              ? "Fallido"
                              : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formularios de Pago */}
          <div className="space-y-6">
            {/* Pago de Depósito */}
            {pendingDeposit && (
              <PaymentSetup
                contractId={contractId}
                amount={pendingDeposit.amount}
                currency={contract.currency}
                type="deposit"
                onSuccess={handlePaymentSuccess}
              />
            )}

            {/* Configurar Pagos Mensuales */}
            {!hasActiveSub && !pendingDeposit && (
              <PaymentSetup
                contractId={contractId}
                amount={contract.monthly_rent}
                currency={contract.currency}
                type="rent"
                onSuccess={handlePaymentSuccess}
              />
            )}

            {hasActiveSub && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold text-green-700">Pagos Configurados</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Tus pagos mensuales están configurados y se procesarán automáticamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
