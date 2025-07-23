"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  DollarSign,
  Calendar,
  FileText,
  MessageCircle,
  Phone,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface TenantDashboardProps {
  user: any
  currentRental?: any
  paymentHistory: any[]
  locale: string
}

export function TenantDashboard({ user, currentRental, paymentHistory, locale }: TenantDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const nextPaymentDue = currentRental ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) : null

  const daysUntilPayment = nextPaymentDue
    ? Math.ceil((nextPaymentDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user.profile?.first_name} {user.profile?.last_name}
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tu renta y mantente al día con tus pagos</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline">Inquilino</Badge>
            <Badge variant="outline">{user.profile?.country_code}</Badge>
            <Badge variant="outline">{user.profile?.preferred_currency}</Badge>
          </div>
        </div>

        {/* Current Rental Status */}
        {currentRental ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {daysUntilPayment > 0 ? `${daysUntilPayment} días` : "Vencido"}
                </div>
                <p className="text-xs text-muted-foreground">{nextPaymentDue?.toLocaleDateString() || "N/A"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renta Mensual</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentRental.monthly_rent_amount / 100} {currentRental.monthly_rent_currency}
                </div>
                <p className="text-xs text-muted-foreground">por mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado del Contrato</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Activo</div>
                <p className="text-xs text-muted-foreground">
                  Vence: {new Date(currentRental.end_date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">¡Encuentra tu hogar ideal!</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Actualmente no tienes ninguna propiedad rentada. Explora nuestras opciones disponibles.
                  </p>
                  <Button asChild>
                    <Link href={`/${locale}/propiedades`}>Buscar Propiedades</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="property">Mi Propiedad</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="support">Soporte</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {currentRental ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Estado de Pagos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Último pago</span>
                        </div>
                        <span className="text-green-600 font-bold">Completado</span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          daysUntilPayment <= 5 ? "bg-red-50" : daysUntilPayment <= 10 ? "bg-yellow-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {daysUntilPayment <= 5 ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : daysUntilPayment <= 10 ? (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <Calendar className="h-5 w-5 text-blue-600" />
                          )}
                          <span className="font-medium">Próximo pago</span>
                        </div>
                        <span
                          className={`font-bold ${
                            daysUntilPayment <= 5
                              ? "text-red-600"
                              : daysUntilPayment <= 10
                                ? "text-yellow-600"
                                : "text-blue-600"
                          }`}
                        >
                          {daysUntilPayment > 0 ? `${daysUntilPayment} días` : "Vencido"}
                        </span>
                      </div>

                      <Button className="w-full" size="lg">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar Renta
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contactar Propietario
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Contrato
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Calendar className="h-4 w-4 mr-2" />
                        Historial de Pagos
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Reportar Problema
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes propiedades rentadas</h3>
                <p className="text-gray-600 mb-6">Explora nuestras opciones disponibles y encuentra tu hogar ideal</p>
                <Button asChild size="lg">
                  <Link href={`/${locale}/propiedades`}>
                    <Home className="h-4 w-4 mr-2" />
                    Buscar Propiedades
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Property Tab */}
          <TabsContent value="property" className="space-y-6">
            {currentRental ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Property Details */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Mi Propiedad Actual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{currentRental.properties?.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {currentRental.properties?.city}, {currentRental.properties?.country}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Inicio del Contrato</p>
                            <p className="font-semibold">{new Date(currentRental.start_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Fin del Contrato</p>
                            <p className="font-semibold">{new Date(currentRental.end_date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Descripción</p>
                          <p className="text-gray-700">{currentRental.properties?.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Owner Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Propietario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {currentRental.owner_first_name} {currentRental.owner_last_name}
                        </h4>
                        <p className="text-sm text-gray-600">Propietario</p>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </Button>
                        {currentRental.owner_phone && (
                          <Button variant="outline" className="w-full bg-transparent" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes propiedades rentadas</h3>
                <p className="text-gray-600">Una vez que rentes una propiedad, aparecerá aquí</p>
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Historial de Pagos</h2>
              {currentRental && (
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar Renta
                </Button>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transacciones</CardTitle>
                <CardDescription>Historial completo de pagos</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.transaction_type}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {payment.amount / 100} {payment.currency}
                          </p>
                          <Badge
                            variant={payment.status === "COMPLETED" ? "default" : "secondary"}
                            className={
                              payment.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay historial de pagos disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <h2 className="text-2xl font-bold">Centro de Soporte</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contacto de Emergencia</CardTitle>
                  <CardDescription>Para problemas urgentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar Soporte 24/7
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat en Vivo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recursos Útiles</CardTitle>
                  <CardDescription>Guías y preguntas frecuentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Guía del Inquilino
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Preguntas Frecuentes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
