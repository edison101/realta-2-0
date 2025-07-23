import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { markReviewAsHelpful } from "@/lib/reviews/service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const success = await markReviewAsHelpful(params.id, user.id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Error procesando solicitud" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error marking review as helpful:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
