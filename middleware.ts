import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // Lista de locales soportados para Latinoamérica
  locales: [
    "es-MX", // Español México
    "es-AR", // Español Argentina
    "es-CO", // Español Colombia
    "es-CL", // Español Chile
    "es-PE", // Español Perú
    "pt-BR", // Portugués Brasil
    "es-UY", // Español Uruguay
    "es-BO", // Español Bolivia
    "es-PY", // Español Paraguay
    "es-CR", // Español Costa Rica
    "es-GT", // Español Guatemala
    "es-HN", // Español Honduras
    "es-NI", // Español Nicaragua
    "es-PA", // Español Panamá
    "es-DO", // Español República Dominicana
    "en-US", // Inglés para usuarios internacionales
  ],

  // Locale por defecto
  defaultLocale: "es-MX",

  // Estrategia de detección de locale
  localeDetection: true,
})

export const config = {
  // Aplicar middleware a todas las rutas excepto API y archivos estáticos
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
