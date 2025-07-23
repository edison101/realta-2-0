export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-8">
            🏡 Realta 2.0
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Plataforma Inmobiliaria Global
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra y gestiona propiedades en renta en Latinoamérica. 
            La forma más fácil de conectar propietarios con inquilinos.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <a 
              href="/propiedades" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Ver Propiedades
            </a>
            <a 
              href="/registro" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Registrarse
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Buscar Fácil</h3>
              <p className="text-gray-600">Encuentra propiedades con filtros avanzados</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Pagos Seguros</h3>
              <p className="text-gray-600">Sistema de pagos integrado con Stripe</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Chat Directo</h3>
              <p className="text-gray-600">Comunícate directamente con propietarios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
