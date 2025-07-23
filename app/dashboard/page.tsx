"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, MessageCircle, Calendar, Settings, Plus, Eye, Edit, Trash2, Star, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de ejemplo del usuario
const userData = {
  name: "María González",
  email: "maria@example.com",
  userType: "OWNER", // o "TENANT"
  avatar: "/placeholder.svg?height=60&width=60&text=MG",
  joinDate: "Enero 2024",
  rating: 4.8,
  reviewsCount: 24,
}

// Datos de ejemplo para propiedades del propietario
const ownerProperties = [
  {
    id: "1",
    title: "Apartamento Moderno Zona 10",
    address: "Zona 10, Ciudad de Guatemala",
    price: 1200,
    currency: "USD",
    status: "RENTED",
    tenant: "Carlos Mendoza",
    image: "/placeholder.svg?height=100&width=150&text=Apt+1",
    views: 245,
    inquiries: 12,
  },
  {
    id: "2",
    title: "Casa Familiar en Las Condes",
    address: "Las Condes, Santiago",
    price: 2200,
    currency: "USD",
    status: "AVAILABLE",
    tenant: null,
    image: "/placeholder.svg?height=100&width=150&text=Casa+2",
    views: 189,
    inquiries: 8,
  },
]

// Datos de ejemplo para inquilino
const tenantRentals = [
  {
    id: "1",
    title: "Apartamento en Polanco",
    address: "Polanco, Ciudad de México",
    price: 1800,
    currency: "USD",
    owner: "Ana Rodríguez",
    contractEnd: "2024-12-31",
    image: "/placeholder.svg?height=100&width=150&text=Rental+1",
    status: "ACTIVE",
  },
]

// Mensajes recientes
const recentMessages = [
  {
    id: "1",
    from: "Carlos Mendoza",
    message: "¿Podríamos revisar el contrato de renovación?",
    time: "Hace 2 horas",
    unread: true,
  },
  {
    id: "2",
    from: "Ana Rodríguez",
    message: "El pago de este mes ya fue procesado",
    time: "Ayer",
    unread: false,
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const isOwner = userData.userType === "OWNER"

  const stats = isOwner
    ? [
        {
          title: "Propiedades Activas",
          value: ownerProperties.length,
          icon: Home,
          color: "text-blue-600",
        },
        {
          title: "Ingresos Mensuales",
          value: `$${ownerProperties.reduce((sum, prop) => (prop.status === "RENTED" ? sum + prop.price : sum), 0)}`,
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          title: "Vistas Totales",
          value: ownerProperties.reduce((sum, prop) => sum + prop.views, 0),
          icon: Eye,
          color: "text-purple-600",
        },
        {
          title: "Consultas",
          value: ownerProperties.reduce((sum, prop) => sum + prop.inquiries, 0),
          icon: MessageCircle,
          color: "text-orange-600",
        },
      ]
    : [
        {
          title: "Propiedades Rentadas",
          value: tenantRentals.length,
          icon: Home,
          color: "text-blue-600",
        },
        {
          title: "Pago Mensual",
          value: `$${tenantRentals.reduce((sum, rental) => sum + rental.price, 0)}`,
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          title: "Contratos Activos",
          value: tenantRentals.filter((r) => r.status === "ACTIVE").length,
          icon: Calendar,
          color: "text-purple-600",
        },
        {
          title: "Mensajes",
          value: recentMessages.filter((m) => m.unread).length,
          icon: MessageCircle,
          color: "text-orange-600",
        },
      ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">¡Hola, {userData.name.split(" ")[0]}!</h1>
              <p className="text-gray-600">
                {isOwner ? "Propietario" : "Inquilino"} desde {userData.joinDate}
              </p>
              {isOwner && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{userData.rating}</span>
                  <span className="text-sm text-gray-500">({userData.reviewsCount} reseñas)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isOwner && (
              <Button asChild>
                <Link href="/propiedades/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/perfil">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Link>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenido principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="properties">{isOwner ? "Mis Propiedades" : "Mis Rentas"}</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actividad reciente */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isOwner ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nuevo inquilino confirmado</p>
                            <p className="text-xs text-gray-500">Carlos Mendoza - Apartamento Zona 10</p>
                          </div>
                          <span className="text-xs text-gray-500">Hace 2 días</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Pago recibido</p>
                            <p className="text-xs text-gray-500">$1,200 USD - Renta de febrero</p>
                          </div>
                          <span className="text-xs text-gray-500">Hace 3 días</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nueva consulta</p>
                            <p className="text-xs text-gray-500">Casa en Las Condes - 5 interesados</p>
                          </div>
                          <span className="text-xs text-gray-500">Hace 1 semana</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Pago procesado</p>
                            <p className="text-xs text-gray-500">$1,800 USD - Renta de febrero</p>
                          </div>
                          <span className="text-xs text-gray-500">Hace 1 día</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Mensaje del propietario</p>
                            <p className="text-xs text-gray-500">Ana Rodríguez te envió un mensaje</p>
                          </div>
                          <span className="text-xs text-gray-500">Hace 2 días</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Próximos pagos o vencimientos */}
              <Card>
                <CardHeader>
                  <CardTitle>{isOwner ? "Próximos Pagos" : "Próximos Vencimientos"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isOwner ? (
                      <>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-green-900">Carlos Mendoza</p>
                            <p className="text-sm text-green-700">Apartamento Zona 10</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-900">$1,200</p>
                            <p className="text-xs text-green-600">Vence en 5 días</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-blue-900">Renta Mensual</p>
                            <p className="text-sm text-blue-700">Apartamento en Polanco</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-900">$1,800</p>
                            <p className="text-xs text-blue-600">Vence en 5 días</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <p className="font-medium text-yellow-900">Renovación de Contrato</p>
                            <p className="text-sm text-yellow-700">Apartamento en Polanco</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-yellow-600">Vence en 3 meses</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{isOwner ? "Mis Propiedades" : "Mis Rentas"}</h2>
              {isOwner && (
                <Button asChild>
                  <Link href="/propiedades/nueva">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Propiedad
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isOwner ? ownerProperties : tenantRentals).map((property) => (
                <Card key={property.id}>
                  <div className="relative">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${
                        property.status === "RENTED" || property.status === "ACTIVE" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {property.status === "RENTED"
                        ? "Rentada"
                        : property.status === "ACTIVE"
                          ? "Activa"
                          : "Disponible"}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.address}</p>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-2xl font-bold text-green-600">${property.price}</span>
                        <span className="text-gray-500 ml-1">{property.currency}/mes</span>
                      </div>
                    </div>

                    {isOwner ? (
                      <>
                        {property.tenant && <p className="text-sm text-gray-600 mb-3">Inquilino: {property.tenant}</p>}
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                          <span>{property.views} vistas</span>
                          <span>{property.inquiries} consultas</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 mb-3">Propietario: {property.owner}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Contrato hasta: {new Date(property.contractEnd).toLocaleDateString()}
                        </p>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/propiedades/${property.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      {isOwner && (
                        <>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mensajes Recientes</h2>
              <Button asChild>
                <Link href="/chat">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ver Todos
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recentMessages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {message.from
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{message.from}</h3>
                          <p className="text-sm text-gray-600">{message.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">{message.time}</span>
                        {message.unread && <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 ml-auto" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
