import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Bed, Bath, Square, Car, Wifi, Tv, AirVent, Star, MessageCircle, Heart } from "lucide-react"
import ReviewList from "@/components/reviews/review-list"
import ReviewForm from "@/components/reviews/review-form"
import ChatWidget from "@/components/chat/chat-widget"
import Link from "next/link"

interface PropertyPageProps {
  params: { locale: string; id: string }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const supabase = createClient()

  // Obtener propiedad con detalles del propietario
  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      owner:owner_id(id, full_name, avatar_url, email),
      images:property_images(*)
    `)
    .eq("id", params.id)
    .eq("status", "AVAILABLE")
    .single()

  if (error || !property) {
    notFound()
  }

  // Obtener usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verificar si el usuario puede escribir una reseña
  let canReview = false
  let hasContract = false

  if (user) {
    const { data: contract } = await supabase
      .from("contracts")
      .select("id")
      .eq("property_id", params.id)
      .eq("tenant_id", user.id)
      .eq("status", "COMPLETED")
      .single()

    hasContract = !!contract
    canReview = hasContract

    // Verificar si ya escribió una reseña
    if (canReview) {
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("property_id", params.id)
        .eq("reviewer_id", user.id)
        .single()

      canReview = !existingReview
    }
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    tv: Tv,
    aire_acondicionado: AirVent,
    parking: Car,
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de Imágenes */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].image_url || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Square className="h-16 w-16" />
                    </div>
                  )}
                </div>
                {property.images && property.images.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {property.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                          <img
                            src={image.image_url || "/placeholder.svg"}
                            alt={`${property.title} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Principal */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {property.address}, {property.city}, {property.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      {property.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{property.average_rating.toFixed(1)}</span>
                          <span className="text-gray-600">({property.review_count} reseñas)</span>
                        </div>
                      )}
                      <Badge variant="secondary">{property.property_type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(property.price, property.currency)}
                    </div>
                    <div className="text-gray-600">por mes</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-500" />
                    <span>{property.bedrooms} habitaciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-500" />
                    <span>{property.bathrooms} baños</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-gray-500" />
                    <span>{property.area} m²</span>
                  </div>
                  {property.parking_spaces > 0 && (
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-gray-500" />
                      <span>{property.parking_spaces} estacionamientos</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="font-semibold mb-3">Amenidades</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity: string, index: number) => {
                          const IconComponent = amenityIcons[amenity] || Wifi
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-gray-500" />
                              <span className="capitalize">{amenity.replace("_", " ")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList propertyId={params.id} />
              </CardContent>
            </Card>

            {/* Formulario de Reseña */}
            {canReview && <ReviewForm propertyId={params.id} contractId={hasContract ? "contract-id" : undefined} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del Propietario */}
            <Card>
              <CardHeader>
                <CardTitle>Propietario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {property.owner.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{property.owner.full_name}</p>
                    <p className="text-sm text-gray-600">Propietario verificado</p>
                  </div>
                </div>

                {user && user.id !== property.owner_id && (
                  <div className="space-y-2">
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Heart className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones */}
            {user && user.id !== property.owner_id && (
              <Card>
                <CardHeader>
                  <CardTitle>¿Te interesa esta propiedad?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/propiedades/${params.id}/solicitar`}>Solicitar Renta</Link>
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Al solicitar, el propietario recibirá tu información de contacto
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Información Adicional */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de propiedad:</span>
                  <span className="font-medium">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Área:</span>
                  <span className="font-medium">{property.area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponible desde:</span>
                  <span className="font-medium">{new Date(property.available_from).toLocaleDateString()}</span>
                </div>
                {property.deposit_amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Depósito:</span>
                    <span className="font-medium">{formatCurrency(property.deposit_amount, property.currency)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Widget */}
        {user && user.id !== property.owner_id && (
          <ChatWidget propertyId={params.id} ownerId={property.owner_id} tenantId={user.id} />
        )}
      </div>
    </div>
  )
}
