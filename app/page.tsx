import { HeroSection } from "@/components/sections/hero-section"
import { Suspense } from "react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Cargando...</div>}>
        <HeroSection />
      </Suspense>
      
      {/* Secciones adicionales se añadirán aquí */}
    </div>
  )
}
