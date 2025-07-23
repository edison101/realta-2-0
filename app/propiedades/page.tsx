"use client"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { currencyConverter } from "@/lib/currency/converter"
import { PropertyCard } from "@/components/property/property-card"
import { SearchFilters } from "@/components/search/search-filters"
import { CurrencySelector } from "@/components/currency/currency-selector"
import { useSearchParams } from "next/navigation"

function PropertiesPageInner() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const preferredCurrency = searchParams.get("currency") || "USD"

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

        // Convert prices
        const propertiesWithConvertedPrices = await Promise.all(
          (properties || []).map(async (property) => {
            const conversion = await currencyConverter.convertPrice(
              property.price_amount,
              property.price_currency,
              preferredCurrency,
              "es-MX"
            )

            return {
              ...property,
              convertedPrice: conversion,
            }
          })
        )

        setProperties(propertiesWithConvertedPrices)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams, preferredCurrency])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12">Error: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Propiedades en Renta</h1>
        <p className="text-gray-600">
          Encuentra tu hogar ideal entre {properties.length} propiedades disponibles
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <SearchFilters />
          <CurrencySelector currentCurrency={preferredCurrency} />
        </div>
      </div>

      {/* Resultados */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
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
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Cargando propiedades...</div>}>
      <PropertiesPageInner />
    </Suspense>
  )
}