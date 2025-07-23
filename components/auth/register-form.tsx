"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-helpers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LATIN_AMERICAN_CURRENCIES } from "@/lib/currency/converter"

const COUNTRIES = {
  MX: { name: "México", currency: "MXN", locale: "es-MX", timezone: "America/Mexico_City" },
  BR: { name: "Brasil", currency: "BRL", locale: "pt-BR", timezone: "America/Sao_Paulo" },
  AR: { name: "Argentina", currency: "ARS", locale: "es-AR", timezone: "America/Argentina/Buenos_Aires" },
  CO: { name: "Colombia", currency: "COP", locale: "es-CO", timezone: "America/Bogota" },
  CL: { name: "Chile", currency: "CLP", locale: "es-CL", timezone: "America/Santiago" },
  PE: { name: "Perú", currency: "PEN", locale: "es-PE", timezone: "America/Lima" },
  UY: { name: "Uruguay", currency: "UYU", locale: "es-UY", timezone: "America/Montevideo" },
  BO: { name: "Bolivia", currency: "BOB", locale: "es-BO", timezone: "America/La_Paz" },
  PY: { name: "Paraguay", currency: "PYG", locale: "es-PY", timezone: "America/Asuncion" },
  CR: { name: "Costa Rica", currency: "CRC", locale: "es-CR", timezone: "America/Costa_Rica" },
  GT: { name: "Guatemala", currency: "GTQ", locale: "es-GT", timezone: "America/Guatemala" },
  HN: { name: "Honduras", currency: "HNL", locale: "es-HN", timezone: "America/Tegucigalpa" },
  NI: { name: "Nicaragua", currency: "NIO", locale: "es-NI", timezone: "America/Managua" },
  PA: { name: "Panamá", currency: "PAB", locale: "es-PA", timezone: "America/Panama" },
  DO: { name: "República Dominicana", currency: "DOP", locale: "es-DO", timezone: "America/Santo_Domingo" },
}

export function RegisterForm() {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "",
    role: "TENANT" as "TENANT" | "OWNER",
  })

  const selectedCountry = COUNTRIES[formData.countryCode as keyof typeof COUNTRIES]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (!selectedCountry) {
      toast({
        title: "Error",
        description: "Por favor selecciona tu país",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        country_code: formData.countryCode,
        preferred_currency: selectedCountry.currency,
        preferred_locale: selectedCountry.locale,
        timezone: selectedCountry.timezone,
        role: formData.role,
      })

      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu correo electrónico para activar tu cuenta.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("auth.register.title")}</CardTitle>
        <CardDescription>Únete a la plataforma inmobiliaria líder en Latinoamérica</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("auth.register.firstName")}</Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t("auth.register.lastName")}</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t("auth.register.email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">{t("auth.register.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="country">{t("auth.register.country")}</Label>
            <Select
              value={formData.countryCode}
              onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRIES).map(([code, country]) => (
                  <SelectItem key={code} value={code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCountry && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Moneda:</strong> {selectedCountry.currency} (
                {LATIN_AMERICAN_CURRENCIES[selectedCountry.currency as keyof typeof LATIN_AMERICAN_CURRENCIES]?.symbol})
              </p>
              <p className="text-sm text-gray-600">
                <strong>Zona horaria:</strong> {selectedCountry.timezone}
              </p>
            </div>
          )}

          <div>
            <Label>Tipo de cuenta</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "TENANT" | "OWNER") => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TENANT">Inquilino - Busco propiedades</SelectItem>
                <SelectItem value="OWNER">Propietario - Rento mis propiedades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">{t("auth.register.password")}</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : t("auth.register.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
