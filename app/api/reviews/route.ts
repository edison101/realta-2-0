import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createReview } from "@/lib/reviews/service"

export async function POST(request: NextRequest) {
  try {
    const { propertyId, contractId, rating, title, comment } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Validaciones
    if (!propertyId || !rating || !title || !comment) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "La calificación debe estar entre 1 y 5" }, { status: 400 })
    }

    // Verificar que no haya ya una reseña del usuario para esta propiedad
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("property_id", propertyId)
      .eq("reviewer_id", user.id)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: "Ya has escrito una reseña para esta propiedad" }, { status: 400 })
    }

    const review = await createReview(propertyId, user.id, rating, title, comment, "property", contractId)

    if (review) {
      return NextResponse.json(review)
    } else {
      return NextResponse.json({ error: "Error creando reseña" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
