import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createConnectedAccount, createAccountLink } from "@/lib/stripe/customers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Obtener datos del usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que es propietario
    const { data: profile } = await supabase.from("users").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "OWNER") {
      return NextResponse.json({ error: "Solo propietarios pueden configurar pagos" }, { status: 403 })
    }

    // Crear o obtener cuenta conectada
    const accountId = await createConnectedAccount(user.id, "GT")

    // Crear link de onboarding
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pagos/configurar?success=true`
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pagos/configurar?refresh=true`

    const onboardingUrl = await createAccountLink(accountId, returnUrl, refreshUrl)

    return NextResponse.json({
      url: onboardingUrl,
      accountId,
    })
  } catch (error) {
    console.error("Error creating onboarding link:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
