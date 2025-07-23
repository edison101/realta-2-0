"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Loader2, User, Briefcase, Users, Phone } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { currencyConverter, LATIN_AMERICAN_CURRENCIES } from "@/lib/currency/converter"

interface RentalApplicationFormProps {
  property: any
  user: any
  locale: string
}

export function RentalApplicationForm({ property, user, locale }: RentalApplicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [desiredStartDate, setDesiredStartDate] = useState<Date>()

  const [formData, setFormData] = useState({
    // Información personal
    first_name: user.profile?.first_name || "",
    last_name: user.profile?.last_name || "",
    email: user.email || "",
    phone: user.profile?.phone || "",
    date_of_birth: "",
    identification_number: "",
    identification_type: "DPI",

    // Información laboral
    employment_status: "EMPLOYED",
    employer_name: "",
    job_title: "",
    monthly_income_amount: "",
    monthly_income_currency: user.profile?.preferred_currency || "USD",
    employment_duration_months: "",

    // Referencias
    personal_reference_name: "",
    personal_reference_phone: "",
    personal_reference_relationship: "",
    previous_landlord_name: "",
    previous_landlord_phone: "",
    previous_rental_address: "",

    // Contacto de emergencia
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",

    // Términos propuestos
    desired_lease_duration_months: "12",
    proposed_monthly_rent_amount: (property.price_amount / 100).toString(),
    proposed_monthly_rent_currency: property.price_currency,
    tenant_notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const applicationData = {
        ...formData,
        property_id: property.id,
        owner_id: property.owner_id,
        desired_start_date: desiredStartDate?.toISOString().split("T")[0],
        monthly_income_amount: Math.round(Number.parseFloat(formData.monthly_income_amount) * 100),
        proposed_monthly_rent_amount: Math.round(Number.parseFloat(formData.proposed_monthly_rent_amount) * 100),
        desired_lease_duration_months: Number.parseInt(formData.desired_lease_duration_months),
        employment_duration_months: Number.parseInt(formData.employment_duration_months) || null,
      }

      const response = await fetch("/api/rental-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud")
      }

      const result = await response.json()
      router.push(`/${locale}/dashboard?tab=applications&success=true`)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al enviar la solicitud. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Información Personal", icon: User },
    { number: 2, title: "Información Laboral", icon: Briefcase },
    { number: 3, title: "Referencias", icon: Users },
    { number: 4, title: "Términos", icon: Phone },
  ]

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitud de Arrendamiento</h1>
        <p className="text-gray-600">Completa la información para solicitar el arrendamiento de esta propiedad</p>
      </div>

      {/* Property Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
              {property.images?.[0] && (
                <img
                  src={property.images[0].url || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{property.title}</h3>
              <p className="text-gray-600 mb-2">
                {property.address}, {property.city}, {property.country}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{property.bedrooms} habitaciones</span>
                <span>{property.bathrooms} baños</span>
                {property.area_sqm && <span>{property.area_sqm} m²</span>}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-green-600">
                  {currencyConverter.formatCurrency(
                    property.price_amount,
                    property.price_currency,
                    user.profile?.preferred_locale || "es-MX",
                  )}
                </span>
                <span className="text-gray-500 ml-1">/mes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep >= step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400",
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn("text-sm font-medium", currentStep >= step.number ? "text-blue-600" : "text-gray-400")}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-4 transition-colors",
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-300",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {steps[currentStep - 1].icon({ className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              Paso {currentStep} de {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Nombres *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Apellidos *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="identification_type">Tipo de Identificación</Label>
                    <Select
                      value={formData.identification_type}
                      onValueChange={(value) => handleInputChange("identification_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DPI">DPI</SelectItem>
                        <SelectItem value="CEDULA">Cédula</SelectItem>
                        <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="identification_number">Número de Identificación *</Label>
                  <Input
                    id="identification_number"
                    value={formData.identification_number}
                    onChange={(e) => handleInputChange("identification_number", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Employment Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employment_status">Estado Laboral *</Label>
                  <Select
                    value={formData.employment_status}
                    onValueChange={(value) => handleInputChange("employment_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYED">Empleado</SelectItem>
                      <SelectItem value="SELF_EMPLOYED">Trabajador Independiente</SelectItem>
                      <SelectItem value="UNEMPLOYED">Desempleado</SelectItem>
                      <SelectItem value="STUDENT">Estudiante</SelectItem>
                      <SelectItem value="RETIRED">Jubilado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.employment_status === "EMPLOYED" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employer_name">Nombre del Empleador *</Label>
                        <Input
                          id="employer_name"
                          value={formData.employer_name}
                          onChange={(e) => handleInputChange("employer_name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="job_title">Puesto de Trabajo *</Label>
                        <Input
                          id="job_title"
                          value={formData.job_title}
                          onChange={(e) => handleInputChange("job_title", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="employment_duration_months">Tiempo en el Empleo (meses)</Label>
                      <Input
                        id="employment_duration_months"
                        type="number"
                        value={formData.employment_duration_months}
                        onChange={(e) => handleInputChange("employment_duration_months", e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly_income_amount">Ingresos Mensuales *</Label>
                    <Input
                      id="monthly_income_amount"
                      type="number"
                      step="0.01"
                      value={formData.monthly_income_amount}
                      onChange={(e) => handleInputChange("monthly_income_amount", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly_income_currency">Moneda</Label>
                    <Select
                      value={formData.monthly_income_currency}
                      onValueChange={(value) => handleInputChange("monthly_income_currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LATIN_AMERICAN_CURRENCIES).map(([code, info]) => (
                          <SelectItem key={code} value={code}>
                            {info.symbol} {code} - {info.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: References */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Referencia Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="personal_reference_name">Nombre Completo *</Label>
                      <Input
                        id="personal_reference_name"
                        value={formData.personal_reference_name}
                        onChange={(e) => handleInputChange("personal_reference_name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="personal_reference_phone">Teléfono *</Label>
                      <Input
                        id="personal_reference_phone"
                        value={formData.personal_reference_phone}
                        onChange={(e) => handleInputChange("personal_reference_phone", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="personal_reference_relationship">Relación *</Label>
                      <Input
                        id="personal_reference_relationship"
                        value={formData.personal_reference_relationship}
                        onChange={(e) => handleInputChange("personal_reference_relationship", e.target.value)}
                        placeholder="Ej: Amigo, Familiar"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Referencia de Arrendador Anterior (Opcional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="previous_landlord_name">Nombre del Arrendador</Label>
                      <Input
                        id="previous_landlord_name"
                        value={formData.previous_landlord_name}
                        onChange={(e) => handleInputChange("previous_landlord_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="previous_landlord_phone">Teléfono</Label>
                      <Input
                        id="previous_landlord_phone"
                        value={formData.previous_landlord_phone}
                        onChange={(e) => handleInputChange("previous_landlord_phone", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="previous_rental_address">Dirección de la Propiedad Anterior</Label>
                    <Textarea
                      id="previous_rental_address"
                      value={formData.previous_rental_address}
                      onChange={(e) => handleInputChange("previous_rental_address", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Contacto de Emergencia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact_name">Nombre Completo *</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_phone">Teléfono *</Label>
                      <Input
                        id="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_relationship">Relación *</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship}
                        onChange={(e) => handleInputChange("emergency_contact_relationship", e.target.value)}
                        placeholder="Ej: Padre, Hermano"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Terms */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>Fecha de Inicio Deseada *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !desiredStartDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {desiredStartDate ? (
                          format(desiredStartDate, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={desiredStartDate}
                        onSelect={setDesiredStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="desired_lease_duration_months">Duración del Contrato (meses) *</Label>
                  <Select
                    value={formData.desired_lease_duration_months}
                    onValueChange={(value) => handleInputChange("desired_lease_duration_months", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="18">18 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proposed_monthly_rent_amount">Renta Mensual Propuesta</Label>
                    <Input
                      id="proposed_monthly_rent_amount"
                      type="number"
                      step="0.01"
                      value={formData.proposed_monthly_rent_amount}
                      onChange={(e) => handleInputChange("proposed_monthly_rent_amount", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="proposed_monthly_rent_currency">Moneda</Label>
                    <Select
                      value={formData.proposed_monthly_rent_currency}
                      onValueChange={(value) => handleInputChange("proposed_monthly_rent_currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LATIN_AMERICAN_CURRENCIES).map(([code, info]) => (
                          <SelectItem key={code} value={code}>
                            {info.symbol} {code} - {info.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tenant_notes">Comentarios Adicionales (Opcional)</Label>
                  <Textarea
                    id="tenant_notes"
                    value={formData.tenant_notes}
                    onChange={(e) => handleInputChange("tenant_notes", e.target.value)}
                    rows={3}
                    placeholder="Cualquier información adicional que consideres relevante..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !desiredStartDate}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
