"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, DollarSign, Upload, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

// Datos de la propiedad (normalmente vendrían de la API)
const propertyData = {
  id: 1,
  title: "Apartamento Moderno en Zona 10",
  city: "Ciudad de Guatemala",
  country: "Guatemala",
  address: "Avenida Las Américas 15-45, Zona 10",
  price: 1200,
  currency: "USD",
  depositAmount: 1200,
  image: "/placeholder.svg?height=200&width=300&text=Apartamento+Moderno",
  owner: {
    name: "María González",
    phone: "+502 5555-1234",
    email: "maria@example.com",
  },
}

export default function RentalApplicationPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    // Información Personal
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    idNumber: "",
    maritalStatus: "",

    // Información Laboral
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    monthlyIncome: "",
    workPhone: "",

    // Información de Vivienda Actual
    currentAddress: "",
    currentLandlord: "",
    currentRent: "",
    reasonForMoving: "",

    // Referencias
    personalReference1Name: "",
    personalReference1Phone: "",
    personalReference1Relationship: "",
    personalReference2Name: "",
    personalReference2Phone: "",
    personalReference2Relationship: "",

    // Información Adicional
    numberOfOccupants: "",
    hasPets: false,
    petDetails: "",
    smokingPolicy: "",
    moveInDate: "",
    leaseTerm: "",
    additionalComments: "",

    // Documentos
    idDocument: null,
    incomeProof: null,
    employmentLetter: null,
    bankStatements: null,

    // Términos y Condiciones
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
    agreeToPropertyInspection: false,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalSteps = 5

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simular envío de formulario
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Información Personal"
      case 2:
        return "Información Laboral"
      case 3:
        return "Referencias"
      case 4:
        return "Documentos"
      case 5:
        return "Revisión y Envío"
      default:
        return ""
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Tu solicitud de renta ha sido enviada exitosamente. El propietario la revisará y te contactará pronto.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">Ir a Mi Dashboard</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/propiedades">Ver Más Propiedades</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href={`/propiedades/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la propiedad
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de la Propiedad */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img
                src={propertyData.image || "/placeholder.svg"}
                alt={propertyData.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitud de Renta</h1>
                <h2 className="text-lg font-semibold text-blue-600 mb-1">{propertyData.title}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{propertyData.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-bold">
                      ${propertyData.price} {propertyData.currency}/mes
                    </span>
                  </div>
                  <Badge variant="outline">Depósito: ${propertyData.depositAmount}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{getStepTitle(currentStep)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>{getStepTitle(currentStep)}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Proporciona tu información personal básica"}
              {currentStep === 2 && "Información sobre tu situación laboral y financiera"}
              {currentStep === 3 && "Referencias personales y de vivienda anterior"}
              {currentStep === 4 && "Sube los documentos requeridos"}
              {currentStep === 5 && "Revisa toda la información antes de enviar"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre Completo *</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Correo Electrónico *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+502 1234-5678"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha de Nacimiento *</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nacionalidad *</label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleInputChange("nationality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guatemalteca">Guatemalteca</SelectItem>
                        <SelectItem value="mexicana">Mexicana</SelectItem>
                        <SelectItem value="argentina">Argentina</SelectItem>
                        <SelectItem value="brasileña">Brasileña</SelectItem>
                        <SelectItem value="otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Número de Identificación *</label>
                    <Input
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                      placeholder="DPI, Cédula, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Estado Civil</label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => handleInputChange("maritalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero">Soltero/a</SelectItem>
                      <SelectItem value="casado">Casado/a</SelectItem>
                      <SelectItem value="divorciado">Divorciado/a</SelectItem>
                      <SelectItem value="viudo">Viudo/a</SelectItem>
                      <SelectItem value="union_libre">Unión Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Paso 2: Información Laboral */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estado Laboral *</label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleInputChange("employmentStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu estado laboral" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empleado">Empleado</SelectItem>
                        <SelectItem value="independiente">Trabajador Independiente</SelectItem>
                        <SelectItem value="empresario">Empresario</SelectItem>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="jubilado">Jubilado</SelectItem>
                        <SelectItem value="desempleado">Desempleado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Ingresos Mensuales (USD) *</label>
                    <Input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      placeholder="3000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Empresa/Empleador</label>
                    <Input
                      value={formData.employer}
                      onChange={(e) => handleInputChange("employer", e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cargo/Puesto</label>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="Tu cargo actual"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono de Trabajo</label>
                  <Input
                    value={formData.workPhone}
                    onChange={(e) => handleInputChange("workPhone", e.target.value)}
                    placeholder="+502 1234-5678"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Dirección Actual *</label>
                  <Textarea
                    value={formData.currentAddress}
                    onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                    placeholder="Tu dirección actual completa"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Paso 3: Referencias */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Referencias Personales</h3>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Referencia Personal #1</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre Completo *</label>
                          <Input
                            value={formData.personalReference1Name}
                            onChange={(e) => handleInputChange("personalReference1Name", e.target.value)}
                            placeholder="Nombre de la referencia"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono *</label>
                          <Input
                            value={formData.personalReference1Phone}
                            onChange={(e) => handleInputChange("personalReference1Phone", e.target.value)}
                            placeholder="+502 1234-5678"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Relación *</label>
                          <Input
                            value={formData.personalReference1Relationship}
                            onChange={(e) => handleInputChange("personalReference1Relationship", e.target.value)}
                            placeholder="Amigo, familiar, etc."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Referencia Personal #2</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre Completo</label>
                          <Input
                            value={formData.personalReference2Name}
                            onChange={(e) => handleInputChange("personalReference2Name", e.target.value)}
                            placeholder="Nombre de la referencia"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono</label>
                          <Input
                            value={formData.personalReference2Phone}
                            onChange={(e) => handleInputChange("personalReference2Phone", e.target.value)}
                            placeholder="+502 1234-5678"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Relación</label>
                          <Input
                            value={formData.personalReference2Relationship}
                            onChange={(e) => handleInputChange("personalReference2Relationship", e.target.value)}
                            placeholder="Amigo, familiar, etc."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Número de Ocupantes</label>
                        <Select
                          value={formData.numberOfOccupants}
                          onValueChange={(value) => handleInputChange("numberOfOccupants", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="¿Cuántas personas vivirán?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 persona</SelectItem>
                            <SelectItem value="2">2 personas</SelectItem>
                            <SelectItem value="3">3 personas</SelectItem>
                            <SelectItem value="4">4 personas</SelectItem>
                            <SelectItem value="5+">5 o más personas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha Deseada de Mudanza</label>
                        <Input
                          type="date"
                          value={formData.moveInDate}
                          onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasPets"
                        checked={formData.hasPets}
                        onCheckedChange={(checked) => handleInputChange("hasPets", checked)}
                      />
                      <label htmlFor="hasPets" className="text-sm font-medium text-gray-700">
                        Tengo mascotas
                      </label>
                    </div>

                    {formData.hasPets && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Detalles de Mascotas</label>
                        <Textarea
                          value={formData.petDetails}
                          onChange={(e) => handleInputChange("petDetails", e.target.value)}
                          placeholder="Describe tus mascotas (tipo, raza, edad, etc.)"
                          rows={3}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Comentarios Adicionales</label>
                      <Textarea
                        value={formData.additionalComments}
                        onChange={(e) => handleInputChange("additionalComments", e.target.value)}
                        placeholder="Cualquier información adicional que consideres relevante"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4: Documentos */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">Documentos Requeridos</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Por favor sube los siguientes documentos para completar tu solicitud. Todos los archivos deben
                        ser en formato PDF, JPG o PNG y no exceder 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Documento de Identidad *</h4>
                      <p className="text-sm text-gray-600 mb-3">DPI, Cédula o Pasaporte</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Archivo
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Comprobante de Ingresos *</h4>
                      <p className="text-sm text-gray-600 mb-3">Últimas 3 boletas de pago</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Archivo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Carta de Trabajo</h4>
                      <p className="text-sm text-gray-600 mb-3">Constancia laboral actual</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Archivo
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Estados Bancarios</h4>
                      <p className="text-sm text-gray-600 mb-3">Últimos 3 meses</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Archivo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 5: Revisión */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900">Revisión Final</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Por favor revisa toda la información antes de enviar tu solicitud. Una vez enviada, el
                        propietario la revisará y te contactará.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Información Personal</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 font-medium">{formData.fullName || "No proporcionado"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{formData.email || "No proporcionado"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="ml-2 font-medium">{formData.phone || "No proporcionado"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nacionalidad:</span>
                        <span className="ml-2 font-medium">{formData.nationality || "No proporcionado"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Información Laboral</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Estado Laboral:</span>
                        <span className="ml-2 font-medium">{formData.employmentStatus || "No proporcionado"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ingresos Mensuales:</span>
                        <span className="ml-2 font-medium">${formData.monthlyIncome || "0"} USD</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Empleador:</span>
                        <span className="ml-2 font-medium">{formData.employer || "No proporcionado"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cargo:</span>
                        <span className="ml-2 font-medium">{formData.jobTitle || "No proporcionado"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      Acepto los{" "}
                      <Link href="/terminos" className="text-blue-600 hover:underline">
                        términos y condiciones
                      </Link>{" "}
                      de Realta 2.0
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToBackgroundCheck"
                      checked={formData.agreeToBackgroundCheck}
                      onCheckedChange={(checked) => handleInputChange("agreeToBackgroundCheck", checked)}
                    />
                    <label htmlFor="agreeToBackgroundCheck" className="text-sm text-gray-700">
                      Autorizo la verificación de antecedentes y referencias
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToPropertyInspection"
                      checked={formData.agreeToPropertyInspection}
                      onCheckedChange={(checked) => handleInputChange("agreeToPropertyInspection", checked)}
                    />
                    <label htmlFor="agreeToPropertyInspection" className="text-sm text-gray-700">
                      Acepto que se realice una inspección de la propiedad antes de la mudanza
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Navegación */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>Siguiente</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeToTerms || !formData.agreeToBackgroundCheck || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
