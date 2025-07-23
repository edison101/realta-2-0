import { stripe } from "./config"
import { createClient } from "@/lib/supabase/server"

export async function createSubscription(
  customerId: string,
  priceId: string,
  contractId: string,
  connectedAccountId: string,
) {
  const supabase = createClient()

  try {
    // Crear suscripción en Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 5, // 5% de comisión
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata: {
        contractId,
      },
    })

    // Guardar en base de datos
    await supabase.from("payments").insert({
      contract_id: contractId,
      stripe_subscription_id: subscription.id,
      amount: (subscription.items.data[0].price?.unit_amount || 0) / 100,
      currency: subscription.items.data[0].price?.currency || "gtq",
      payment_type: "rent",
      status: "pending",
    })

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    }
  } catch (error) {
    console.error("Error creating subscription:", error)
    throw error
  }
}

export async function createPrice(amount: number, currency: string, interval: "month" | "year" = "month") {
  const price = await stripe.prices.create({
    unit_amount: Math.round(amount * 100), // Convertir a centavos
    currency: currency.toLowerCase(),
    recurring: { interval },
    product_data: {
      name: "Renta mensual",
    },
  })

  return price.id
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = createClient()

  try {
    // Cancelar en Stripe
    await stripe.subscriptions.cancel(subscriptionId)

    // Actualizar en base de datos
    await supabase.from("payments").update({ status: "canceled" }).eq("stripe_subscription_id", subscriptionId)

    return true
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}
