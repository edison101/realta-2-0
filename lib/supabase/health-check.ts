import { supabase } from "./client"

export interface HealthCheckResult {
  table: string
  exists: boolean
  count: number
  error?: string
}

export async function performHealthCheck(): Promise<HealthCheckResult[]> {
  const tables = ["users", "properties", "contracts", "transactions", "currency_rates"]
  const results: HealthCheckResult[] = []

  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (error) {
        results.push({
          table,
          exists: false,
          count: 0,
          error: error.message,
        })
      } else {
        results.push({
          table,
          exists: true,
          count: count || 0,
        })
      }
    } catch (error: any) {
      results.push({
        table,
        exists: false,
        count: 0,
        error: error.message,
      })
    }
  }

  return results
}
