import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createConversation, getConversations } from "@/lib/chat/service"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const conversations = await getConversations(user.id)

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId, ownerId, tenantId } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario es parte de la conversación
    if (user.id !== ownerId && user.id !== tenantId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const conversationId = await createConversation(propertyId, ownerId, tenantId)

    if (conversationId) {
      return NextResponse.json({ conversationId })
    } else {
      return NextResponse.json({ error: "Error creando conversación" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
