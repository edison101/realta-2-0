import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/config"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        await supabase
          .from("payments")
          .update({
            status: "succeeded",
            paid_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        await supabase.from("payments").update({ status: "failed" }).eq("stripe_payment_intent_id", failedPayment.id)
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object
        if (invoice.subscription) {
          await supabase
            .from("payments")
            .update({
              status: "succeeded",
              paid_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", invoice.subscription)
        }
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object
        if (failedInvoice.subscription) {
          await supabase
            .from("payments")
            .update({ status: "failed" })
            .eq("stripe_subscription_id", failedInvoice.subscription)
        }
        break

      case "customer.subscription.deleted":
        const subscription = event.data.object
        await supabase.from("payments").update({ status: "canceled" }).eq("stripe_subscription_id", subscription.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
