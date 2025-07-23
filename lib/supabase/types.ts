export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          preferred_currency: string
          preferred_locale: string
          timezone: string
          country_code: string | null
          role: "TENANT" | "OWNER" | "ADMIN"
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_currency?: string
          preferred_locale?: string
          timezone?: string
          country_code?: string | null
          role?: "TENANT" | "OWNER" | "ADMIN"
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_currency?: string
          preferred_locale?: string
          timezone?: string
          country_code?: string | null
          role?: "TENANT" | "OWNER" | "ADMIN"
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          address: string
          city: string
          state: string | null
          country: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          price_amount: number
          price_currency: string
          property_type: "APARTMENT" | "HOUSE" | "CONDO" | "STUDIO" | "ROOM"
          bedrooms: number
          bathrooms: number
          area_sqm: number | null
          amenities: Json
          images: Json
          status: "DRAFT" | "ACTIVE" | "RENTED" | "MAINTENANCE" | "INACTIVE"
          is_featured: boolean
          visibility: "PUBLIC" | "PRIVATE" | "DRAFT"
          rental_status: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE"
          privacy_level: "FULL" | "LIMITED" | "HIDDEN"
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          address: string
          city: string
          state?: string | null
          country: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          price_amount: number
          price_currency?: string
          property_type: "APARTMENT" | "HOUSE" | "CONDO" | "STUDIO" | "ROOM"
          bedrooms?: number
          bathrooms?: number
          area_sqm?: number | null
          amenities?: Json
          images?: Json
          status?: "DRAFT" | "ACTIVE" | "RENTED" | "MAINTENANCE" | "INACTIVE"
          is_featured?: boolean
          visibility?: "PUBLIC" | "PRIVATE" | "DRAFT"
          rental_status?: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE"
          privacy_level?: "FULL" | "LIMITED" | "HIDDEN"
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          address?: string
          city?: string
          state?: string | null
          country?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          price_amount?: number
          price_currency?: string
          property_type?: "APARTMENT" | "HOUSE" | "CONDO" | "STUDIO" | "ROOM"
          bedrooms?: number
          bathrooms?: number
          area_sqm?: number | null
          amenities?: Json
          images?: Json
          status?: "DRAFT" | "ACTIVE" | "RENTED" | "MAINTENANCE" | "INACTIVE"
          is_featured?: boolean
          visibility?: "PUBLIC" | "PRIVATE" | "DRAFT"
          rental_status?: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE"
          privacy_level?: "FULL" | "LIMITED" | "HIDDEN"
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          property_id: string
          tenant_id: string
          owner_id: string
          monthly_rent_amount: number
          monthly_rent_currency: string
          deposit_amount: number
          deposit_currency: string
          start_date: string
          end_date: string
          status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
          terms_template: string | null
          application_id: string | null
          template_id: string | null
          contract_content: string | null
          signed_by_tenant_at: string | null
          signed_by_owner_at: string | null
          tenant_signature_data: Json | null
          owner_signature_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          tenant_id: string
          owner_id: string
          monthly_rent_amount: number
          monthly_rent_currency: string
          deposit_amount: number
          deposit_currency: string
          start_date: string
          end_date: string
          status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
          terms_template?: string | null
          application_id?: string | null
          template_id?: string | null
          contract_content?: string | null
          signed_by_tenant_at?: string | null
          signed_by_owner_at?: string | null
          tenant_signature_data?: Json | null
          owner_signature_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          tenant_id?: string
          owner_id?: string
          monthly_rent_amount?: number
          monthly_rent_currency?: string
          deposit_amount?: number
          deposit_currency?: string
          start_date?: string
          end_date?: string
          status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
          terms_template?: string | null
          application_id?: string | null
          template_id?: string | null
          contract_content?: string | null
          signed_by_tenant_at?: string | null
          signed_by_owner_at?: string | null
          tenant_signature_data?: Json | null
          owner_signature_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "payment" | "contract" | "property" | "system" | "chat"
          read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: "payment" | "contract" | "property" | "system" | "chat"
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "payment" | "contract" | "property" | "system" | "chat"
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          property_id: string
          reviewer_id: string
          contract_id: string | null
          rating: number
          title: string
          comment: string
          review_type: "property" | "owner" | "tenant"
          is_verified: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          reviewer_id: string
          contract_id?: string | null
          rating: number
          title: string
          comment: string
          review_type: "property" | "owner" | "tenant"
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          reviewer_id?: string
          contract_id?: string | null
          rating?: number
          title?: string
          comment?: string
          review_type?: "property" | "owner" | "tenant"
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
