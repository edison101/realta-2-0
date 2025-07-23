import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
}

// Configuración por país
export const COUNTRY_CONFIG = {
  GT: {
    currency: "gtq",
    locale: "es-GT",
    commissionRate: 0.05,
    stripeAccount: "US",
  },
  MX: {
    currency: "mxn",
    locale: "es-MX",
    commissionRate: 0.05,
    stripeAccount: "MX",
  },
  US: {
    currency: "usd",
    locale: "en-US",
    commissionRate: 0.05,
    stripeAccount: "US",
  },
  AR: {
    currency: "ars",
    locale: "es-AR",
    commissionRate: 0.05,
    stripeAccount: "US",
  },
  CO: {
    currency: "cop",
    locale: "es-CO",
    commissionRate: 0.05,
    stripeAccount: "US",
  },
} as const

export type CountryCode = keyof typeof COUNTRY_CONFIG
