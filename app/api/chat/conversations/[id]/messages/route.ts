import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMessages, sendMessage, markMessagesAsRead } from "@/lib/chat/service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const messages = await getMessages(params.id)

    // Marcar mensajes como leídos
    await markMessagesAsRead(params.id, user.id)

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { message } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const newMessage = await sendMessage(params.id, user.id, message)

    if (newMessage) {
      return NextResponse.json(newMessage)
    } else {
      return NextResponse.json({ error: "Error enviando mensaje" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
