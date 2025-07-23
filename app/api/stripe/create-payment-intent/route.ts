import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/config"
import { createClient } from "@/lib/supabase/server"
import { createStripeCustomer } from "@/lib/stripe/customers"

export async function POST(request: NextRequest) {
  try {
    const { contractId, amount, currency, type } = await request.json()

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

    // Calcular comisión (5%)
    const applicationFeeAmount = Math.round(amount * 100 * 0.05)

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: currency.toLowerCase(),
      customer: customerId,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: ownerAccount.stripe_account_id,
      },
      metadata: {
        contractId,
        type,
        tenantId: user.id,
        ownerId: contract.property.owner_id,
      },
    })

    // Guardar pago en base de datos
    await supabase.from("payments").insert({
      contract_id: contractId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: amount,
      currency: currency.toUpperCase(),
      payment_type: type,
      status: "pending",
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
