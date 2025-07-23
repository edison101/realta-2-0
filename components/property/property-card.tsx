"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, Car, Heart, Share2, Star, Eye, MessageCircle, Calendar } from "lucide-react"
import { PropertyPrivacyBadge } from "./property-privacy-badge"

interface PropertyCardProps {
  property: any
  locale?: string
  showPrivacyInfo?: boolean
}

export function PropertyCard({ property, locale = "es", showPrivacyInfo = false }: PropertyCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  const getPropertyImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0].image_url
    }
    return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(property.title)}`
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Lógica para agregar/quitar de favoritos
    console.log("Toggle favorite for property:", property.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Lógica para compartir
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: `/propiedades/${property.id}`,
      })
    } else {
      // Fallback para copiar al portapapeles
      navigator.clipboard.writeText(`${window.location.origin}/propiedades/${property.id}`)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
      <div className="relative">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getPropertyImage() || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white shadow-sm"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white shadow-sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.is_featured && <Badge className="bg-yellow-500 text-yellow-900 font-semibold">⭐ Destacada</Badge>}

          {property.rental_status === "AVAILABLE" && <Badge className="bg-green-500 text-white">Disponible</Badge>}

          {showPrivacyInfo && (
            <PropertyPrivacyBadge visibility={property.visibility} rentalStatus={property.rental_status} />
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {property.convertedPrice
                ? property.convertedPrice.formattedConverted
                : formatPrice(property.price_amount, property.price_currency)}
            </div>
            <div className="text-sm text-gray-600">por mes</div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.address}, {property.city}, {property.country}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} hab.</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.area} m²</span>
          </div>
          {property.parking_spaces > 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.parking_spaces} parking</span>
            </div>
          )}
        </div>

        {/* Rating and Reviews */}
        {property.average_rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{property.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500 text-sm">({property.review_count} reseñas)</span>
          </div>
        )}

        {/* Property Type and Available Date */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            {property.property_type}
          </Badge>
          {property.available_from && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Desde {new Date(property.available_from).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/propiedades/${property.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalles
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="bg-transparent">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Owner Info (if available) */}
        {property.users && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{property.users.first_name?.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-600">
                {property.users.first_name} {property.users.last_name}
              </span>
              <Badge variant="outline" className="text-xs ml-auto">
                Propietario
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
