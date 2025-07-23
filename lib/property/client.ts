import { createClient } from "@/lib/supabase/client"

export interface PropertyCardData {
  id: string
  title: string
  description: string
  city: string
  country: string
  price_amount: number
  price_currency: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  images: string[]
  is_featured: boolean
  owner: {
    first_name: string
    last_name: string
    phone: string
  }
  convertedPrice?: {
    amount: number
    currency: string
    symbol: string
  }
}

export class PropertyClient {
  private supabase = createClient()

  async getProperties(filters: any = {}) {
    let query = this.supabase
      .from("properties")
      .select(`
        *,
        owner:users!properties_owner_id_fkey(first_name, last_name, phone)
      `)
      .eq("status", "ACTIVE")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
      )
    }

    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`)
    }

    if (filters.type) {
      query = query.eq("property_type", filters.type)
    }

    if (filters.minPrice) {
      query = query.gte("price_amount", Number.parseInt(filters.minPrice) * 100)
    }

    if (filters.maxPrice) {
      query = query.lte("price_amount", Number.parseInt(filters.maxPrice) * 100)
    }

    if (filters.bedrooms) {
      query = query.gte("bedrooms", Number.parseInt(filters.bedrooms))
    }

    if (filters.bathrooms) {
      query = query.gte("bathrooms", Number.parseInt(filters.bathrooms))
    }

    const { data: properties, error } = await query.limit(24)

    if (error) {
      console.error("Error fetching properties:", error)
      return { data: [], error }
    }

    return { data: properties || [], error: null }
  }

  async getPropertyById(id: string) {
    const { data, error } = await this.supabase
      .from("properties")
      .select(`
        *,
        owner:users!properties_owner_id_fkey(first_name, last_name, phone, avatar_url)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching property:", error)
      return { data: null, error }
    }

    return { data, error: null }
  }
}

export const propertyClient = new PropertyClient()