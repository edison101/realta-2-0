"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyPrivacyBadge } from "@/components/property/property-privacy-badge"
import { PropertyCard } from "@/components/property/property-card"
import { Building, DollarSign, Users, TrendingUp, Plus, Edit, Calendar, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"

interface OwnerDashboardProps {
  user: any
  properties: any[]
  contracts: any[]
  transactions: any[]
  stats: {
    totalProperties: number
    activeContracts: number
    monthlyIncome: string
    occupancyRate: number
  }
  locale: string
}

export function OwnerDashboard({ user, properties, contracts, transactions, stats, locale }: OwnerDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const publicProperties = properties.filter((p) => p.visibility === "PUBLIC")
  const privateProperties = properties.filter((p) => p.visibility === "PRIVATE")
  const draftProperties = properties.filter((p) => p.visibility === "DRAFT")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user.profile?.first_name} {user.profile?.last_name}
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tus propiedades y contratos desde tu panel de control</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline">Propietario</Badge>
            <Badge variant="outline">{user.profile?.country_code}</Badge>
            <Badge variant="outline">{user.profile?.preferred_currency}</Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {publicProperties.length} públicas, {privateProperties.length} privadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">inquilinos actuales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyIncome}</div>
              <p className="text-xs text-muted-foreground">{transactions.length} pagos recibidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">de tus propiedades</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Propiedades Recientes</CardTitle>
                    <CardDescription>Últimas propiedades agregadas</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/${locale}/dashboard/propiedades/nueva`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{property.title}</h4>
                          <p className="text-sm text-gray-600">
                            {property.city}, {property.country}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <PropertyPrivacyBadge
                              visibility={property.visibility}
                              rentalStatus={property.rental_status}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/dashboard/propiedades/${property.id}`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle>Contratos Activos</CardTitle>
                  <CardDescription>Inquilinos y pagos actuales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contracts.slice(0, 3).map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">
                            {contract.users?.first_name} {contract.users?.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{contract.properties?.title}</p>
                          <p className="text-xs text-gray-500">
                            Vence: {new Date(contract.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{contract.monthly_rent_amount / 100}</p>
                          <p className="text-sm text-gray-600">{contract.monthly_rent_currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mis Propiedades</h2>
              <Button asChild>
                <Link href={`/${locale}/dashboard/propiedades/nueva`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
            </div>

            {/* Property Status Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Todas ({properties.length})</TabsTrigger>
                <TabsTrigger value="public">Públicas ({publicProperties.length})</TabsTrigger>
                <TabsTrigger value="private">Privadas ({privateProperties.length})</TabsTrigger>
                <TabsTrigger value="draft">Borradores ({draftProperties.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} locale={locale} showPrivacyInfo={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="public">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} locale={locale} showPrivacyInfo={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="private">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {privateProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} locale={locale} showPrivacyInfo={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="draft">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} locale={locale} showPrivacyInfo={true} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestión de Contratos</h2>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Nuevo Contrato
              </Button>
            </div>

            <div className="grid gap-6">
              {contracts.map((contract) => (
                <Card key={contract.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {contract.users?.first_name} {contract.users?.last_name}
                        </CardTitle>
                        <CardDescription>{contract.properties?.title}</CardDescription>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {contract.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Renta Mensual</p>
                        <p className="text-lg font-bold text-green-600">
                          {contract.monthly_rent_amount / 100} {contract.monthly_rent_currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Período</p>
                        <p className="text-sm">
                          {new Date(contract.start_date).toLocaleDateString()} -{" "}
                          {new Date(contract.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Depósito</p>
                        <p className="text-sm">
                          {contract.deposit_amount / 100} {contract.deposit_currency}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Ver Contrato
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Historial de Pagos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Historial de Pagos</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>Últimos pagos recibidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.transaction_type}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +{transaction.amount / 100} {transaction.currency}
                        </p>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics y Reportes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Mes</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mb-2" />
                    <p>Gráfico de ingresos próximamente</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ocupación por Propiedad</CardTitle>
                  <CardDescription>Estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center justify-between">
                        <span className="text-sm">{property.title}</span>
                        <Badge
                          variant={property.rental_status === "RENTED" ? "default" : "outline"}
                          className={
                            property.rental_status === "RENTED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {property.rental_status === "RENTED" ? "Ocupada" : "Disponible"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
