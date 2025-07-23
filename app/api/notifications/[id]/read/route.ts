import { type NextRequest, NextResponse } from "next/server"
import { markNotificationAsRead } from "@/lib/notifications/service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await markNotificationAsRead(params.id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Error marcando como leída" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
