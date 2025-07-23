"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Aquí iría la lógica para suscribir al newsletter
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulación
      toast.success("¡Te has suscrito exitosamente al newsletter!")
      setEmail("")
    } catch (error) {
      toast.error("Error al suscribirse. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const footerSections = [
    {
      title: "Plataforma",
      links: [
        { name: "Buscar Propiedades", href: "/propiedades" },
        { name: "Publicar Propiedad", href: "/dashboard/propiedades/nueva" },
        { name: "Cómo Funciona", href: "/como-funciona" },
        { name: "Precios", href: "/precios" },
        { name: "Ayuda", href: "/ayuda" },
      ],
    },
    {
      title: "Servicios",
      links: [
        { name: "Gestión de Contratos", href: "/servicios/contratos" },
        { name: "Pagos Seguros", href: "/servicios/pagos" },
        { name: "Verificación", href: "/servicios/verificacion" },
        { name: "Seguros", href: "/servicios/seguros" },
        { name: "Soporte 24/7", href: "/soporte" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { name: "Acerca de Nosotros", href: "/acerca" },
        { name: "Carreras", href: "/carreras" },
        { name: "Prensa", href: "/prensa" },
        { name: "Blog", href: "/blog" },
        { name: "Inversionistas", href: "/inversionistas" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Términos de Servicio", href: "/terminos" },
        { name: "Política de Privacidad", href: "/privacidad" },
        { name: "Cookies", href: "/cookies" },
        { name: "Disputas", href: "/disputas" },
        { name: "Accesibilidad", href: "/accesibilidad" },
      ],
    },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/realta" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/realta" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/realta" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/realta" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/realta" },
  ]

  const countries = [
    { name: "Guatemala", flag: "🇬🇹", active: true },
    { name: "México", flag: "🇲🇽", active: true },
    { name: "Argentina", flag: "🇦🇷", active: true },
    { name: "Colombia", flag: "🇨🇴", active: true },
    { name: "Chile", flag: "🇨🇱", active: true },
    { name: "Perú", flag: "🇵🇪", active: true },
    { name: "Brasil", flag: "🇧🇷", active: true },
    { name: "Uruguay", flag: "🇺🇾", active: false },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 p-8 bg-primary rounded-lg text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Mantente actualizado</h3>
            <p className="text-primary-foreground/80 mb-6">
              Recibe las mejores ofertas de propiedades y noticias del mercado inmobiliario
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground text-primary"
              />
              <Button type="submit" variant="secondary" disabled={loading} className="shrink-0">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Realta</span>
              <Badge variant="secondary" className="text-xs">
                2.0
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              La plataforma más completa para alquiler de propiedades en Latinoamérica. Conectamos propietarios e
              inquilinos de forma segura y eficiente.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contacto@realta.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+502 2345-6789</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Ciudad de Guatemala, Guatemala</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button key={social.name} variant="ghost" size="sm" asChild className="h-9 w-9 p-0">
                    <Link href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Countries Section */}
        <div className="border-t pt-8 mb-8">
          <h4 className="font-semibold mb-4">Países donde operamos</h4>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Badge key={country.name} variant={country.active ? "default" : "secondary"} className="text-xs">
                <span className="mr-1">{country.flag}</span>
                {country.name}
                {!country.active && <span className="ml-1 text-xs opacity-60">(Próximamente)</span>}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">© 2024 Realta. Todos los derechos reservados.</div>

          <div className="flex items-center space-x-6 text-sm">
            <Link href="/terminos" className="text-muted-foreground hover:text-primary">
              Términos
            </Link>
            <Link href="/privacidad" className="text-muted-foreground hover:text-primary">
              Privacidad
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary">
              Cookies
            </Link>
            <div className="text-muted-foreground">Versión 2.0.1</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
