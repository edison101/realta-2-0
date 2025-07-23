export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-8">
          🏡 Realta 2.0
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          Plataforma Inmobiliaria Global
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Encuentra y gestiona propiedades en renta en Latinoamérica
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="/propiedades" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Propiedades
          </a>
          <a 
            href="/registro" 
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  )
}
