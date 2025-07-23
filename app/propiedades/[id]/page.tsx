"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos de ejemplo para la propiedad
const propertyData = {
  id: "1",
  title: "Apartamento Moderno en Zona 10",
  description:
    "Hermoso apartamento completamente amueblado en el corazón de la Zona 10. Cuenta con acabados de lujo, vista panorámica de la ciudad y acceso a todas las comodidades modernas. Perfecto para profesionales o parejas que buscan comodidad y estilo en una ubicación privilegiada.",
  property_type: "APARTMENT",
  bedrooms: 2,
  bathrooms: 2,
  area_sqm: 85,
  price_amount: 120000, // en centavos
  price_currency: "USD",
  city: "Ciudad de Guatemala",
  state: "Guatemala",
  country: "Guatemala",
  address: "Zona 10, Ciudad de Guatemala",
  is_featured: true,
  images: [
    "/placeholder.svg?height=400&width=600&text=Sala+Principal",
    "/placeholder.svg?height=400&width=600&text=Cocina+Moderna",
    "/placeholder.svg?height=400&width=600&text=Dormitorio+Principal",
    "/placeholder.svg?height=400&width=600&text=Baño+Completo",
    "/placeholder.svg?height=400&width=600&text=Vista+Panorámica",
  ],
  amenities: [
    { name: "WiFi", icon: Wifi },
    { name: "Estacionamiento", icon: Car },
    { name: "Gimnasio", icon: Dumbbell },
    { name: "Piscina", icon: Waves },
    { name: "Seguridad 24/7", icon: Shield },
  ],
  owner: {
    id: "owner-1",
    first_name: "María",
    last_name: "González",
    phone: "+502 1234-5678",
    email: "maria@example.com",
    avatar: "/placeholder.svg?height=60&width=60&text=MG",
    rating: 4.8,
    reviews_count: 24,
    verified: true,
    response_time: "Responde en menos de 1 hora",
    languages: ["Español", "Inglés"],
  },
  availability: {
    available_from: "2024-02-01",
    minimum_stay: 6, // meses
    maximum_stay: 24, // meses
  },
  rules: [
    "No se permiten mascotas",
    "No fumar en el interior",
    "Máximo 4 personas",
    "No fiestas o eventos",
    "Respetar horarios de silencio (10 PM - 8 AM)",
  ],
  location: {
    lat: 14.6349,
    lng: -90.5069,
    neighborhood: "Zona 10",
    nearby: [
      "Centro Comercial Oakland Mall - 5 min",
      "Hospital Herrera Llerandi - 10 min",
      "Universidad Francisco Marroquín - 15 min",
      "Aeropuerto La Aurora - 20 min",
    ],
  },
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const property = propertyData // En una app real, esto vendría de una API

  const propertyTypeLabels = {
    APARTMENT: "Departamento",
    HOUSE: "Casa",
    CONDO: "Condominio",
    STUDIO: "Estudio",
    ROOM: "Habitación",
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Galería de imágenes */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <img
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Navegación de imágenes */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>

        {/* Botones de acción flotantes */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShare} className="bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Badge de destacado */}
        {property.is_featured && (
          <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Destacada
          </Badge>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.address}</span>
                    </div>
                    <Badge variant="secondary">
                      {propertyTypeLabels[property.property_type as keyof typeof propertyTypeLabels]}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      ${(property.price_amount / 100).toLocaleString()} USD
                    </div>
                    <div className="text-sm text-gray-500">por mes</div>
                  </div>
                </div>

                {/* Características */}
                <div className="flex items-center gap-6 py-4 border-t border-b">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="text-gray-600 ml-1">recámaras</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="text-gray-600 ml-1">baños</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">{property.area_sqm}</span>
                    <span className="text-gray-600 ml-1">m²</span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comodidades */}
            <Card>
              <CardHeader>
                <CardTitle>Comodidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{property.location.neighborhood}</span>
                  </div>

                  <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p>Mapa interactivo</p>
                      <p className="text-sm">
                        Lat: {property.location.lat}, Lng: {property.location.lng}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Lugares cercanos:</h4>
                    <ul className="space-y-1">
                      {property.location.nearby.map((place, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                          {place}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reglas */}
            <Card>
              <CardHeader>
                <CardTitle>Reglas de la propiedad</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {property.rules.map((rule, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del propietario */}
            <Card>
              <CardHeader>
                <CardTitle>Propietario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={property.owner.avatar || "/placeholder.svg"} alt={property.owner.first_name} />
                    <AvatarFallback>
                      {property.owner.first_name[0]}
                      {property.owner.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {property.owner.first_name} {property.owner.last_name}
                      </h3>
                      {property.owner.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{property.owner.rating}</span>
                      <span>({property.owner.reviews_count} reseñas)</span>
                    </div>
                    <p className="text-sm text-gray-500">{property.owner.response_time}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/propiedades/${property.id}/solicitar`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Solicitar Renta
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/chat?owner=${property.owner.id}`}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`tel:${property.owner.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Llamar
                      </Link>
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Idiomas:</span>
                    <span className="ml-2">{property.owner.languages.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Disponible desde:</span>
                  <p className="text-sm text-gray-600">
                    {new Date(property.availability.available_from).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Estancia mínima:</span>
                  <p className="text-sm text-gray-600">{property.availability.minimum_stay} meses</p>
                </div>
                <div>
                  <span className="font-medium">Estancia máxima:</span>
                  <p className="text-sm text-gray-600">{property.availability.maximum_stay} meses</p>
                </div>
              </CardContent>
            </Card>

            {/* Propiedades similares */}
            <Card>
              <CardHeader>
                <CardTitle>Propiedades Similares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <img
                        src={`/placeholder.svg?height=60&width=80&text=Propiedad+${i}`}
                        alt={`Propiedad similar ${i}`}
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Apartamento en Zona {10 + i}</h4>
                        <p className="text-xs text-gray-600">2 rec • 2 baños • 75m²</p>
                        <p className="text-sm font-semibold text-blue-600">$1,{100 + i * 50} USD</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  Ver más similares
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
