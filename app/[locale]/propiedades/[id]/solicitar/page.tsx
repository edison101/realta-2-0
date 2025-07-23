import { requireAuth } from "@/lib/auth/auth-helpers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { RentalApplicationForm } from "@/components/contracts/rental-application-form"
import { redirect } from "next/navigation"

export default async function RentalApplicationPage({
  params,
}: {
  params: { locale: string; id: string }
}) {
  const user = await requireAuth()
  const supabase = createServerSupabaseClient()

  // Solo inquilinos pueden acceder
  if (user.profile?.role !== "TENANT") {
    redirect(`/${params.locale}/propiedades/${params.id}`)
  }

  // Obtener la propiedad
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .eq("status", "ACTIVE")
    .single()

  if (error || !property) {
    redirect(`/${params.locale}/propiedades`)
  }

  // Verificar que no sea el propietario
  if (property.owner_id === user.id) {
    redirect(`/${params.locale}/propiedades/${params.id}`)
  }

  // Verificar que no tenga una solicitud pendiente
  const { data: existingApplication } = await supabase
    .from("rental_applications")
    .select("id, status")
    .eq("property_id", params.id)
    .eq("tenant_id", user.id)
    .in("status", ["PENDING", "APPROVED"])
    .single()

  if (existingApplication) {
    redirect(`/${params.locale}/dashboard?tab=applications`)
  }

  return <RentalApplicationForm property={property} user={user} locale={params.locale} />
}
