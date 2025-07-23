import { createClient } from "./server"

export interface PropertyPrivacySettings {
  show_exact_address: boolean
  show_owner_contact: boolean
  show_price_history: boolean
  show_tenant_info: boolean
  allow_public_photos: boolean
  require_verification: boolean
}

export interface PropertyWithPrivacy {
  id: string
  title: string
  description: string
  display_address: string // Dirección filtrada según privacidad
  city: string
  country: string
  price_amount: number
  price_currency: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  amenities: string[]
  images: string[]
  visibility: "PUBLIC" | "PRIVATE" | "DRAFT"
  rental_status: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE"
  privacy_level: "FULL" | "LIMITED" | "HIDDEN"
  is_featured: boolean
  status: string
  created_at: string
  updated_at: string
  // Información del propietario (filtrada)
  contact_phone?: string
  contact_email?: string
  owner_first_name?: string
  owner_last_name?: string
  // Configuración de privacidad
  show_exact_address: boolean
  show_owner_contact: boolean
  allow_public_photos: boolean
}

export class PropertyPrivacyManager {
  private supabase = createClient()

  /**
   * Obtiene propiedades públicas (disponibles para renta)
   */
  async getPublicProperties(filters: any = {}) {
    let query = this.supabase.from("public_properties").select("*")

    // Aplicar filtros
    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`)
    }

    if (filters.country) {
      query = query.eq("country", filters.country)
    }

    if (filters.propertyType) {
      query = query.eq("property_type", filters.propertyType)
    }

    if (filters.minPrice && filters.maxPrice) {
      query = query.gte("price_amount", filters.minPrice).lte("price_amount", filters.maxPrice)
    }

    const { data, error } = await query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching public properties:", error)
      return { data: [], error }
    }

    return { data: this.sanitizePublicProperties(data || []), error: null }
  }

  /**
   * Obtiene una propiedad específica con nivel de privacidad apropiado
   */
  async getPropertyById(propertyId: string, userId?: string) {
    const supabase = this.supabase

    // Primero verificar si el usuario tiene acceso a esta propiedad
    const accessLevel = await this.checkPropertyAccess(propertyId, userId)

    if (accessLevel === "NONE") {
      return { data: null, error: { message: "Property not found or access denied" } }
    }

    let query
    if (accessLevel === "FULL") {
      // Propietario o inquilino - acceso completo
      query = supabase.from("private_properties").select("*").eq("id", propertyId)
    } else {
      // Acceso público - información limitada
      query = supabase.from("public_properties").select("*").eq("id", propertyId)
    }

    const { data, error } = await query.single()

    if (error) {
      return { data: null, error }
    }

    return { data: this.sanitizePropertyData(data, accessLevel), error: null }
  }

  /**
   * Verifica el nivel de acceso de un usuario a una propiedad
   */
  private async checkPropertyAccess(propertyId: string, userId?: string): Promise<"FULL" | "LIMITED" | "NONE"> {
    if (!userId) {
      // Usuario no autenticado - solo acceso público
      const { data } = await this.supabase
        .from("properties")
        .select("visibility, rental_status")
        .eq("id", propertyId)
        .single()

      if (data?.visibility === "PUBLIC" && data?.rental_status === "AVAILABLE") {
        return "LIMITED"
      }
      return "NONE"
    }

    // Verificar si es propietario
    const { data: ownerCheck } = await this.supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .eq("owner_id", userId)
      .single()

    if (ownerCheck) {
      return "FULL"
    }

    // Verificar si es inquilino activo
    const { data: tenantCheck } = await this.supabase
      .from("contracts")
      .select("id")
      .eq("property_id", propertyId)
      .eq("tenant_id", userId)
      .eq("status", "ACTIVE")
      .single()

    if (tenantCheck) {
      return "FULL"
    }

    // Verificar si la propiedad es pública
    const { data: publicCheck } = await this.supabase
      .from("properties")
      .select("visibility, rental_status")
      .eq("id", propertyId)
      .single()

    if (publicCheck?.visibility === "PUBLIC" && publicCheck?.rental_status === "AVAILABLE") {
      return "LIMITED"
    }

    return "NONE"
  }

  /**
   * Sanitiza datos de propiedades públicas
   */
  private sanitizePublicProperties(properties: any[]): PropertyWithPrivacy[] {
    return properties.map((property) => ({
      ...property,
      // Ocultar información sensible para propiedades públicas
      images: property.allow_public_photos ? property.images : [property.images?.[0] || "/placeholder.svg"],
      // La dirección ya viene filtrada desde la vista
    }))
  }

  /**
   * Sanitiza datos según el nivel de acceso
   */
  private sanitizePropertyData(property: any, accessLevel: "FULL" | "LIMITED"): PropertyWithPrivacy {
    if (accessLevel === "FULL") {
      return property // Acceso completo
    }

    // Acceso limitado - filtrar información sensible
    return {
      ...property,
      images: property.allow_public_photos ? property.images : [property.images?.[0] || "/placeholder.svg"],
      // Otros campos ya vienen filtrados desde la vista public_properties
    }
  }

  /**
   * Actualiza la configuración de privacidad de una propiedad
   */
  async updatePropertyPrivacy(propertyId: string, ownerId: string, settings: Partial<PropertyPrivacySettings>) {
    // Verificar que el usuario es el propietario
    const { data: property } = await this.supabase.from("properties").select("owner_id").eq("id", propertyId).single()

    if (!property || property.owner_id !== ownerId) {
      return { error: { message: "Unauthorized" } }
    }

    const { data, error } = await this.supabase
      .from("property_privacy_settings")
      .upsert({
        property_id: propertyId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()

    return { data, error }
  }

  /**
   * Cambia el estado de una propiedad (público/privado)
   */
  async updatePropertyVisibility(
    propertyId: string,
    ownerId: string,
    visibility: "PUBLIC" | "PRIVATE" | "DRAFT",
    rentalStatus: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE",
  ) {
    const { data, error } = await this.supabase
      .from("properties")
      .update({
        visibility,
        rental_status: rentalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", propertyId)
      .eq("owner_id", ownerId)
      .select()

    return { data, error }
  }
}

export const propertyPrivacyManager = new PropertyPrivacyManager()
