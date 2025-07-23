"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Home, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Encuentra tu hogar ideal en Latinoamérica",
      subtitle: "Miles de propiedades verificadas en 15+ países",
      image: "/placeholder.svg?height=600&width=1200&text=Propiedades+Modernas",
    },
    {
      title: "Renta segura con pagos automáticos",
      subtitle: "Sistema de pagos integrado con Stripe",
      image: "/placeholder.svg?height=600&width=1200&text=Pagos+Seguros",
    },
    {
      title: "Conecta con propietarios verificados",
      subtitle: "Chat directo y contratos digitales",
      image: "/placeholder.svg?height=600&width=1200&text=Comunicación+Directa",
    },
  ]

  const stats = [
    { icon: Home, label: "Propiedades", value: "50,000+" },
    { icon: Users, label: "Usuarios", value: "100,000+" },
    { icon: MapPin, label: "Ciudades", value: "500+" },
    { icon: TrendingUp, label: "Satisfacción", value: "98%" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/propiedades?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">{slides[currentSlide].title}</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">{slides[currentSlide].subtitle}</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="¿Dónde quieres vivir? (Ciudad, país...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </Button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link href="/propiedades?type=APARTMENT">Departamentos</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link href="/propiedades?type=HOUSE">Casas</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link href="/propiedades?featured=true">Destacadas</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
