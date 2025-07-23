import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()

    const data = await request.json()

    // Validar que el usuario sea un inquilino
    if (user.profile?.role !== "TENANT") {
      return NextResponse.json(
        { error: "Solo los inquilinos pueden enviar solicitudes de arrendamiento" },
        { status: 403 },
      )
    }

    // Verificar que la propiedad existe y está disponible
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", data.property_id)
      .eq("status", "ACTIVE")
      .single()

    if (propertyError || !property) {
      return NextResponse.json({ error: "Propiedad no encontrada o no disponible" }, { status: 404 })
    }

    // Verificar que no existe una solicitud pendiente para esta propiedad
    const { data: existingApplication } = await supabase
      .from("rental_applications")
      .select("id")
      .eq("property_id", data.property_id)
      .eq("tenant_id", user.id)
      .eq("status", "PENDING")
      .single()

    if (existingApplication) {
      return NextResponse.json({ error: "Ya tienes una solicitud pendiente para esta propiedad" }, { status: 400 })
    }

    // Crear la solicitud
    const { data: application, error: applicationError } = await supabase
      .from("rental_applications")
      .insert({
        ...data,
        tenant_id: user.id,
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Error creating application:", applicationError)
      return NextResponse.json({ error: "Error al crear la solicitud" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      application,
      message: "Solicitud enviada exitosamente",
    })
  } catch (error) {
    console.error("Error in rental applications API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const propertyId = searchParams.get("property_id")

    let query = supabase.from("rental_applications").select(`
        *,
        properties(title, address, city, country, price_amount, price_currency),
        users!rental_applications_tenant_id_fkey(first_name, last_name, email, phone)
      `)

    // Filtrar según el rol del usuario
    if (user.profile?.role === "OWNER") {
      query = query.eq("owner_id", user.id)
    } else if (user.profile?.role === "TENANT") {
      query = query.eq("tenant_id", user.id)
    } else {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 })
    }

    // Aplicar filtros adicionales
    if (status) {
      query = query.eq("status", status)
    }

    if (propertyId) {
      query = query.eq("property_id", propertyId)
    }

    const { data: applications, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching applications:", error)
      return NextResponse.json({ error: "Error al obtener las solicitudes" }, { status: 500 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error in rental applications GET API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
