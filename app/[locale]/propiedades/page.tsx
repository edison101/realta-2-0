"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PropertyCard } from "@/components/property/property-card"
import { SearchFilters } from "@/components/search/search-filters"
import { CurrencySelector } from "@/components/currency/currency-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PageProps {
  params: { locale: string }
  searchParams: { [key: string]: string | undefined }
}

export default function PropertiesPage({ params, searchParams }: PageProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const preferredCurrency = searchParams.currency || "USD"

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      const supabase = createClient()
      
      try {
        let query = supabase
          .from("properties")
          .select(`
            *,
            users!properties_owner_id_fkey(first_name, last_name, phone)
          `)
          .eq("status", "ACTIVE")
          .order("is_featured", { ascending: false })
          .limit(50)

        const { data: properties, error } = await query

        if (error) {
          throw new Error("Error cargando propiedades")
        }

        setProperties(properties || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams])

  if (loading) {
    return <div className="text-center py-12">Cargando propiedades...</div>
  }

  if (error) {
    return <div className="text-center py-12">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Propiedades en Renta</h1>
          <p className="text-gray-600">
            {properties.length} propiedades disponibles
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchFilters />
            <CurrencySelector currentCurrency={preferredCurrency} />
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={params.locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}