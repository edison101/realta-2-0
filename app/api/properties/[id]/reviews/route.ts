import { type NextRequest, NextResponse } from "next/server"
import { getPropertyReviews } from "@/lib/reviews/service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviews = await getPropertyReviews(params.id)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching property reviews:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
