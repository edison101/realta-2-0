import { SupabaseTest } from "@/components/test/supabase-test"

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Supabase</h1>
          <p className="text-gray-600">Verifica y configura tu conexión a la base de datos</p>
        </div>

        <SupabaseTest />

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pasos de Configuración Manual</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">1. Obtener credenciales de Supabase</h3>
              <p className="text-sm text-gray-600 mt-1">Ve a tu panel de Supabase → Settings → API y copia:</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Project URL</li>
                <li>• anon/public key</li>
                <li>• service_role key (solo para servidor)</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium">2. Configurar variables de entorno</h3>
              <p className="text-sm text-gray-600 mt-1">
                Crea un archivo <code className="bg-gray-100 px-1 rounded">.env.local</code> con:
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=https://phakfnedzdxpybictlmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui`}
              </pre>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium">3. Ejecutar scripts SQL</h3>
              <p className="text-sm text-gray-600 mt-1">
                En el SQL Editor de Supabase, ejecuta los scripts de la carpeta{" "}
                <code className="bg-gray-100 px-1 rounded">scripts/</code>
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium">4. Configurar RLS (Row Level Security)</h3>
              <p className="text-sm text-gray-600 mt-1">
                Habilita RLS en las tablas y configura las políticas de acceso
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
