import { type NextRequest, NextResponse } from "next/server"
import { getReviewStats } from "@/lib/reviews/service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stats = await getReviewStats(params.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching review stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
