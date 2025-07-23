"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Home, Bed, Bath, Car, DollarSign, X } from "lucide-react"

const propertyTypes = [
  { value: "APARTMENT", label: "Departamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "CONDO", label: "Condominio" },
  { value: "STUDIO", label: "Estudio" },
  { value: "ROOM", label: "Habitación" },
]

const countries = [
  { value: "GT", label: "Guatemala" },
  { value: "MX", label: "México" },
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brasil" },
  { value: "CO", label: "Colombia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
  { value: "CR", label: "Costa Rica" },
]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Get current filter values
  const currentFilters = {
    search: searchParams.get("search") || "",
    country: searchParams.get("country") || "",
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    minPrice: Number.parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: Number.parseInt(searchParams.get("maxPrice") || "10000"),
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    parking: searchParams.get("parking") === "true",
    furnished: searchParams.get("furnished") === "true",
    petFriendly: searchParams.get("petFriendly") === "true",
  }

  const [filters, setFilters] = useState(currentFilters)
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== false) {
        if (key === "minPrice" && value > 0) params.set(key, value.toString())
        else if (key === "maxPrice" && value < 10000) params.set(key, value.toString())
        else if (key !== "minPrice" && key !== "maxPrice") {
          params.set(key, value.toString())
        }
      }
    })

    // Handle price range
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())

    router.push(`/propiedades?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "",
      city: "",
      type: "",
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: "",
      bathrooms: "",
      parking: false,
      furnished: false,
      petFriendly: false,
    })
    setPriceRange([0, 10000])
    router.push("/propiedades")
    setIsOpen(false)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.country) count++
    if (filters.city) count++
    if (filters.type) count++
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++
    if (filters.bedrooms) count++
    if (filters.bathrooms) count++
    if (filters.parking) count++
    if (filters.furnished) count++
    if (filters.petFriendly) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Quick Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar por ciudad, dirección o código postal..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 h-12"
          onKeyPress={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      {/* Quick Filters - Desktop */}
      <div className="hidden lg:flex items-center gap-2">
        <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
          <SelectTrigger className="w-40 h-12">
            <Home className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
          <SelectTrigger className="w-32 h-12">
            <Bed className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Hab." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Cualquiera</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={applyFilters} className="h-12 px-6">
          Buscar
        </Button>
      </div>

      {/* Advanced Filters Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-12 relative bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros de Búsqueda</SheetTitle>
            <SheetDescription>Refina tu búsqueda para encontrar la propiedad perfecta</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Location */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Ubicación
              </Label>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Ciudad"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Tipo de Propiedad
              </Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Rango de Precio (USD/mes)
              </Label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Bed className="h-4 w-4 mr-2" />
                  Habitaciones
                </Label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Bath className="h-4 w-4 mr-2" />
                  Baños
                </Label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Comodidades</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.parking}
                    onChange={(e) => handleFilterChange("parking", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Car className="h-4 w-4" />
                  <span>Estacionamiento</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.furnished}
                    onChange={(e) => handleFilterChange("furnished", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Home className="h-4 w-4" />
                  <span>Amueblado</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.petFriendly}
                    onChange={(e) => handleFilterChange("petFriendly", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span>🐕</span>
                  <span>Acepta mascotas</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Button */}
      <Button onClick={applyFilters} className="lg:hidden h-12">
        Buscar
      </Button>
    </div>
  )
}
