import { createBrowserClient } from "@supabase/ssr"

// Configuración con credenciales reales
const supabaseUrl = "https://phakfnedzdxpybictlmv.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYWtmbmVkemR4cHliaWN0bG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTUyNDEsImV4cCI6MjA2ODY3MTI0MX0.3jV_n_KjmNzOlLO7YRi8ABhou5t0jeIQuOTkCxr8iwY"

// Cliente singleton para evitar múltiples instancias
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClientSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseClient
}

export const supabase = createClientSupabaseClient()

// Función para probar la conexión
export async function testConnection() {
  try {
    console.log("🔄 Probando conexión a Supabase...")

    // Probar una consulta simple
    const { data, error } = await supabase.from("currency_rates").select("count").limit(1)

    if (error) {
      console.error("❌ Error de conexión:", error.message)
      return { success: false, error: error.message }
    }

    console.log("✅ Conexión a Supabase exitosa")
    return { success: true, data }
  } catch (error: any) {
    console.error("❌ Error crítico:", error.message)
    return { success: false, error: error.message }
  }
}

// Función para verificar el estado de autenticación
export async function checkAuthStatus() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error verificando sesión:", error.message)
      return null
    }

    return session
  } catch (error) {
    console.error("Error crítico verificando auth:", error)
    return null
  }
}

// Función para crear un cliente Supabase
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
