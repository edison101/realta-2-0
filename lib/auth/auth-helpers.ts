import { createClient } from "@/lib/supabase/client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/supabase/types"

export async function getUser() {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Obtener información adicional del usuario desde nuestra tabla
    const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

    return {
      ...user,
      profile: userProfile,
    }
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getUser()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}

export async function requireRole(role: "TENANT" | "OWNER" | "ADMIN", redirectTo = "/unauthorized") {
  const user = await requireAuth()

  if (!user.profile || user.profile.role !== role) {
    redirect(redirectTo)
  }

  return user
}

// Hook para el cliente
export function useAuth() {
  const supabase = createClientComponentClient<Database>()

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (error) throw error

    // Crear perfil en nuestra tabla
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email!,
        ...userData,
      })

      if (profileError) throw profileError
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    signUp,
    signIn,
    signOut,
  }
}
