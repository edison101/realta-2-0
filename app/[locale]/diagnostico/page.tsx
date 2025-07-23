import { ConnectionDashboard } from "@/components/test/connection-dashboard"

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Realta 2.0</h1>
          <p className="text-xl text-gray-600 mb-4">Diagnóstico de Sistema</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>Estado:</strong> Conectado a Supabase con credenciales reales
            </p>
            <p className="text-blue-700 text-xs mt-1">Base de datos: phakfnedzdxpybictlmv.supabase.co</p>
          </div>
        </div>

        <ConnectionDashboard />

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Próximos Pasos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-700 mb-2">✅ Completado</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Conexión a Supabase configurada</li>
                <li>• Credenciales reales implementadas</li>
                <li>• Sistema de diagnóstico funcional</li>
                <li>• Arquitectura multi-moneda lista</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🔄 Siguiente</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Ejecutar scripts SQL en Supabase</li>
                <li>• Configurar Row Level Security</li>
                <li>• Poblar datos de ejemplo</li>
                <li>• Probar funcionalidades completas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
