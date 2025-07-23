import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  country: string
  city: string
  userType: "OWNER" | "TENANT"
}

export class AuthService {
  private supabase = createClient()

  // Iniciar sesión
  async login(data: LoginData) {
    try {
      const { data: result, error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        user: result.user,
        session: result.session,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Registrar nuevo usuario
  async register(data: RegisterData) {
    try {
      // Crear cuenta de autenticación
      const { data: authResult, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authResult.user) {
        throw new Error("No se pudo crear el usuario")
      }

      // Crear perfil en la tabla users
      const { error: profileError } = await this.supabase.from("users").insert({
        id: authResult.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        country_code: data.country,
        user_type: data.userType,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creando perfil:", profileError)
        // No throwing here because auth user was created successfully
      }

      return {
        success: true,
        user: authResult.user,
        session: authResult.session,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        console.error("Error obteniendo usuario:", error)
        return null
      }

      return user
    } catch (error) {
      console.error("Error crítico obteniendo usuario:", error)
      return null
    }
  }

  // Obtener sesión actual
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) {
        console.error("Error obteniendo sesión:", error)
        return null
      }

      return session
    } catch (error) {
      console.error("Error crítico obteniendo sesión:", error)
      return null
    }
  }

  // Recuperar contraseña
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Actualizar contraseña
  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Obtener perfil completo del usuario
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        profile: data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

// Instancia singleton del servicio de autenticación
export const authService = new AuthService()