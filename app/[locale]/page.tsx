import { createServerSupabaseClient } from "@/lib/supabase/server"
import { currencyConverter } from "@/lib/currency/converter"
import { PropertyCard } from "@/components/property/property-card"
import { HeroSection } from "@/components/sections/hero-section"
import { SearchFilters } from "@/components/search/search-filters"
import { CurrencySelector } from "@/components/currency/currency-selector"

interface PageProps {
  params: { locale: string }
  searchParams: {
    currency?: string
    city?: string
    type?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const supabase = createServerSupabaseClient()

  // Determinar moneda preferida del usuario
  const preferredCurrency = searchParams.currency || "USD"

  // Construir query de propiedades con filtros
  let query = supabase
    .from("properties")
    .select(`
      *,
      users!properties_owner_id_fkey(first_name, last_name, phone)
    `)
    .eq("status", "ACTIVE")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  // Aplicar filtros
  if (searchParams.city) {
    query = query.ilike("city", `%${searchParams.city}%`)
  }

  if (searchParams.type) {
    query = query.eq("property_type", searchParams.type)
  }

  const { data: properties, error } = await query.limit(12)

  if (error) {
    console.error("Error fetching properties:", error)
    return <div>Error loading properties</div>
  }

  // Convertir precios a la moneda preferida del usuario
  const propertiesWithConvertedPrices = await Promise.all(
    (properties || []).map(async (property) => {
      const conversion = await currencyConverter.convertPrice(
        property.price_amount,
        property.price_currency,
        preferredCurrency,
        params.locale,
      )

      return {
        ...property,
        convertedPrice: conversion,
      }
    }),
  )

  const featuredProperties = propertiesWithConvertedPrices.filter((p) => p.is_featured)
  const regularProperties = propertiesWithConvertedPrices.filter((p) => !p.is_featured)

  return (
    <div className="min-h-screen">
      {/* Sección Hero */}
      <HeroSection />

      {/* Barra de búsqueda y filtros */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchFilters />
            <CurrencySelector currentCurrency={preferredCurrency} />
          </div>
        </div>
      </section>

      {/* Propiedades destacadas */}
      {featuredProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Propiedades Destacadas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={params.locale} />
            ))}
          </div>
        </section>
      )}

      {/* Todas las propiedades */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {featuredProperties.length > 0 ? "Más Propiedades" : "Propiedades Disponibles"}
          </h2>
          <p className="text-gray-600">{properties?.length || 0} propiedades encontradas</p>
        </div>

        {regularProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularProperties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={params.locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron propiedades con los filtros seleccionados</p>
          </div>
        )}
      </section>
    </div>
  )
}
