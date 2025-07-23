import { stripe } from "./config"
import { createClient } from "@/lib/supabase/server"

export async function createStripeCustomer(userId: string, email: string) {
  const supabase = createClient()

  // Verificar si ya existe un customer
  const { data: existingCustomer } = await supabase
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single()

  if (existingCustomer) {
    return existingCustomer.stripe_customer_id
  }

  // Crear customer en Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  // Guardar en base de datos
  await supabase.from("stripe_customers").insert({
    user_id: userId,
    stripe_customer_id: customer.id,
    email,
  })

  return customer.id
}

export async function getStripeCustomer(userId: string) {
  const supabase = createClient()

  const { data } = await supabase.from("stripe_customers").select("stripe_customer_id").eq("user_id", userId).single()

  return data?.stripe_customer_id
}

export async function createConnectedAccount(userId: string, country = "GT") {
  const supabase = createClient()

  // Verificar si ya existe una cuenta
  const { data: existingAccount } = await supabase
    .from("stripe_accounts")
    .select("stripe_account_id")
    .eq("user_id", userId)
    .single()

  if (existingAccount) {
    return existingAccount.stripe_account_id
  }

  // Crear cuenta conectada en Stripe
  const account = await stripe.accounts.create({
    type: "express",
    country: country,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      userId,
    },
  })

  // Guardar en base de datos
  await supabase.from("stripe_accounts").insert({
    user_id: userId,
    stripe_account_id: account.id,
    country: country,
  })

  return account.id
}

export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })

  return accountLink.url
}

export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)

  return {
    onboardingComplete: account.details_submitted || false,
    chargesEnabled: account.charges_enabled || false,
    payoutsEnabled: account.payouts_enabled || false,
  }
}

export async function createPrice(productId: string, amount: number, currency: string) {
  return await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: currency.toLowerCase(),
    recurring: {
      interval: "month",
    },
  })
}
