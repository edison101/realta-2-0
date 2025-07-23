import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/config"
import { createClient } from "@/lib/supabase/server"
import { createStripeCustomer, createPrice } from "@/lib/stripe/customers"

export async function POST(request: NextRequest) {
  try {
    const { contractId, amount, currency } = await request.json()

    const supabase = createClient()

    // Obtener datos del usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener contrato con información del propietario
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select(`
        *,
        property:properties(owner_id)
      `)
      .eq("id", contractId)
      .eq("tenant_id", user.id)
      .single()

    if (contractError || !contract) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }

    // Obtener cuenta conectada del propietario
    const { data: ownerAccount } = await supabase
      .from("stripe_accounts")
      .select("stripe_account_id")
      .eq("user_id", contract.property.owner_id)
      .single()

    if (!ownerAccount) {
      return NextResponse.json({ error: "Propietario sin cuenta configurada" }, { status: 400 })
    }

    // Crear o obtener customer de Stripe
    const customerId = await createStripeCustomer(user.id, user.email!)

    // Crear precio para la suscripción
    const priceId = await createPrice(amount, currency, "month")

    // Crear suscripción
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 5, // 5% de comisión
      transfer_data: {
        destination: ownerAccount.stripe_account_id,
      },
      metadata: {
        contractId,
        tenantId: user.id,
        ownerId: contract.property.owner_id,
      },
    })

    // Actualizar contrato con ID de suscripción
    await supabase
      .from("contracts")
      .update({
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
      })
      .eq("id", contractId)

    // Guardar pago en base de datos
    await supabase.from("payments").insert({
      contract_id: contractId,
      stripe_subscription_id: subscription.id,
      amount: amount,
      currency: currency.toUpperCase(),
      payment_type: "rent",
      status: "pending",
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
