import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

// Esta función se ejecutará cada hora para actualizar las tasas de cambio
export async function GET(request: NextRequest) {
  try {
    // Verificar que la solicitud viene del cron de Vercel
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // En producción, aquí consumirías una API real como Open Exchange Rates
    // Para el ejemplo, simularemos fluctuaciones realistas
    const mockRates = {
      MXN: 17.25 + (Math.random() - 0.5) * 0.5, // ±0.25 variación
      ARS: 350.5 + (Math.random() - 0.5) * 10, // ±5 variación
      COP: 4100.0 + (Math.random() - 0.5) * 100, // ±50 variación
      CLP: 850.0 + (Math.random() - 0.5) * 20, // ±10 variación
      PEN: 3.75 + (Math.random() - 0.5) * 0.1, // ±0.05 variación
      BRL: 5.2 + (Math.random() - 0.5) * 0.2, // ±0.1 variación
      UYU: 39.5 + (Math.random() - 0.5) * 1, // ±0.5 variación
      BOB: 6.9 + (Math.random() - 0.5) * 0.1, // ±0.05 variación
      PYG: 7300.0 + (Math.random() - 0.5) * 100, // ±50 variación
      CRC: 520.0 + (Math.random() - 0.5) * 10, // ±5 variación
      GTQ: 7.8 + (Math.random() - 0.5) * 0.2, // ±0.1 variación
      HNL: 24.7 + (Math.random() - 0.5) * 0.5, // ±0.25 variación
      NIO: 36.8 + (Math.random() - 0.5) * 1, // ±0.5 variación
      PAB: 1.0, // Fijo al USD
      DOP: 56.5 + (Math.random() - 0.5) * 2, // ±1 variación
      EUR: 0.92 + (Math.random() - 0.5) * 0.02, // ±0.01 variación
      CAD: 1.35 + (Math.random() - 0.5) * 0.05, // ±0.025 variación
    }

    const updates = []
    for (const [currency, rate] of Object.entries(mockRates)) {
      const { error } = await supabase.from("currency_rates").upsert(
        {
          target_currency: currency,
          rate: Number(rate.toFixed(8)),
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: "base_currency,target_currency",
        },
      )

      if (error) {
        console.error(`Error updating rate for ${currency}:`, error)
      } else {
        updates.push({ currency, rate: rate.toFixed(8) })
      }
    }

    console.log(`Updated ${updates.length} currency rates`)

    return NextResponse.json({
      success: true,
      updated: updates.length,
      rates: updates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating currency rates:", error)
    return NextResponse.json({ error: "Failed to update currency rates" }, { status: 500 })
  }
}
