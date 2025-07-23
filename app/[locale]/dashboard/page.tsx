import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OwnerDashboard from "@/components/dashboard/owner-dashboard"
import TenantDashboard from "@/components/dashboard/tenant-dashboard"
import NotificationBell from "@/components/notifications/notification-bell"
import ChatWidget from "@/components/chat/chat-widget"

export default async function DashboardPage() {
  const supabase = createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profileError || !profile) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {profile.first_name}</h1>
              <p className="text-gray-600 mt-1">
                {profile.user_type === "OWNER" ? "Gestiona tus propiedades y contratos" : "Encuentra tu hogar ideal"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* Dashboard específico por tipo de usuario */}
        {profile.user_type === "OWNER" ? <OwnerDashboard userId={user.id} /> : <TenantDashboard userId={user.id} />}

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </div>
  )
}
