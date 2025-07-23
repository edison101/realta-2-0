import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()
    const { status, owner_notes } = await request.json()

    // Validar que el usuario sea propietario
    if (user.profile?.role !== "OWNER") {
      return NextResponse.json({ error: "Solo los propietarios pueden actualizar solicitudes" }, { status: 403 })
    }

    // Verificar que la solicitud existe y pertenece al propietario
    const { data: application, error: fetchError } = await supabase
      .from("rental_applications")
      .select("*")
      .eq("id", params.id)
      .eq("owner_id", user.id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Solo se pueden actualizar solicitudes pendientes
    if (application.status !== "PENDING") {
      return NextResponse.json({ error: "Solo se pueden actualizar solicitudes pendientes" }, { status: 400 })
    }

    // Actualizar la solicitud
    const { data: updatedApplication, error: updateError } = await supabase
      .from("rental_applications")
      .update({
        status,
        owner_notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating application:", updateError)
      return NextResponse.json({ error: "Error al actualizar la solicitud" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message:
        status === "APPROVED"
          ? "Solicitud aprobada. Se creará automáticamente el contrato."
          : "Solicitud actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error in rental application PATCH API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()

    // Obtener la solicitud con información relacionada
    const { data: application, error } = await supabase
      .from("rental_applications")
      .select(`
        *,
        properties(title, address, city, country, price_amount, price_currency),
        users!rental_applications_tenant_id_fkey(first_name, last_name, email, phone)
      `)
      .eq("id", params.id)
      .single()

    if (error || !application) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    const canView =
      application.tenant_id === user.id || application.owner_id === user.id || user.profile?.role === "ADMIN"

    if (!canView) {
      return NextResponse.json({ error: "No tienes permisos para ver esta solicitud" }, { status: 403 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error in rental application GET API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
