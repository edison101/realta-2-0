import { SupabaseTest } from "@/components/test/supabase-test"

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Prueba de Configuración Supabase
        </h1>
        <SupabaseTest />
      </div>
    </div>
  )
}