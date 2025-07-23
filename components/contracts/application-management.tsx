"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react"
import { currencyConverter } from "@/lib/currency/converter"

interface ApplicationManagementProps {
  applications: any[]
  userRole: "OWNER" | "TENANT"
  locale: string
  onStatusUpdate?: (applicationId: string, status: string, notes?: string) => void
}

function getStatusBadge(status: string) {
  const statusConfig = {
    PENDING: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
    APPROVED: { label: "Aprobada", variant: "default" as const, icon: CheckCircle },
    REJECTED: { label: "Rechazada", variant: "destructive" as const, icon: XCircle },
    WITHDRAWN: { label: "Retirada", variant: "outline" as const, icon: XCircle },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export function ApplicationManagement({ applications, userRole, locale, onStatusUpdate }: ApplicationManagementProps) {
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    if (!onStatusUpdate) return

    setIsUpdating(true)
    try {
      await onStatusUpdate(applicationId, newStatus, reviewNotes)
      setReviewNotes("")
      setSelectedApplication(null)
    } catch (error) {
      console.error("Error updating application:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const pendingApplications = applications.filter((app) => app.status === "PENDING")
  const reviewedApplications = applications.filter((app) => app.status !== "PENDING")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{userRole === "OWNER" ? "Solicitudes Recibidas" : "Mis Solicitudes"}</h2>
          <p className="text-gray-600">
            {userRole === "OWNER"
              ? "Gestiona las solicitudes de arrendamiento de tus propiedades"
              : "Seguimiento de tus solicitudes de arrendamiento"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pendientes ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Revisadas ({reviewedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes pendientes</h3>
                <p className="text-gray-600">
                  {userRole === "OWNER"
                    ? "Las nuevas solicitudes aparecerán aquí"
                    : "Tus solicitudes pendientes aparecerán aquí"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userRole={userRole}
                  onView={setSelectedApplication}
                  onStatusUpdate={userRole === "OWNER" ? handleStatusUpdate : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes revisadas</h3>
                <p className="text-gray-600">Las solicitudes procesadas aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviewedApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userRole={userRole}
                  onView={setSelectedApplication}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalles de la Solicitud
            </DialogTitle>
            <DialogDescription>Información completa del solicitante y términos propuestos</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <ApplicationDetails
              application={selectedApplication}
              userRole={userRole}
              reviewNotes={reviewNotes}
              setReviewNotes={setReviewNotes}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ApplicationCard({
  application,
  userRole,
  onView,
  onStatusUpdate,
}: {
  application: any
  userRole: "OWNER" | "TENANT"
  onView: (app: any) => void
  onStatusUpdate?: (id: string, status: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {userRole === "OWNER"
                ? `${application.users?.first_name} ${application.users?.last_name}`
                : application.properties?.title}
            </h3>
            <p className="text-gray-600 mb-2">
              {userRole === "OWNER"
                ? application.properties?.title
                : `${application.properties?.address}, ${application.properties?.city}`}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(application.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {currencyConverter.formatCurrency(
                  application.proposed_monthly_rent_amount,
                  application.proposed_monthly_rent_currency,
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">{getStatusBadge(application.status)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{application.desired_lease_duration_months} meses</span>
            <span>Inicio: {new Date(application.desired_start_date).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(application)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalles
            </Button>

            {userRole === "OWNER" && application.status === "PENDING" && onStatusUpdate && (
              <>
                <Button
                  size="sm"
                  onClick={() => onStatusUpdate(application.id, "APPROVED")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprobar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onStatusUpdate(application.id, "REJECTED")}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ApplicationDetails({
  application,
  userRole,
  reviewNotes,
  setReviewNotes,
  onStatusUpdate,
  isUpdating,
}: {
  application: any
  userRole: "OWNER" | "TENANT"
  reviewNotes: string
  setReviewNotes: (notes: string) => void
  onStatusUpdate: (id: string, status: string) => void
  isUpdating: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Información de la Propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Propiedad</p>
              <p className="font-semibold">{application.properties?.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ubicación</p>
              <p>
                {application.properties?.address}, {application.properties?.city}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Precio Original</p>
              <p className="font-semibold text-green-600">
                {currencyConverter.formatCurrency(
                  application.properties?.price_amount,
                  application.properties?.price_currency,
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Precio Propuesto</p>
              <p className="font-semibold text-blue-600">
                {currencyConverter.formatCurrency(
                  application.proposed_monthly_rent_amount,
                  application.proposed_monthly_rent_currency,
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Solicitante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
              <p className="font-semibold">
                {application.first_name} {application.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{application.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              <p>{application.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
              <p>{new Date(application.date_of_birth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Identificación</p>
              <p>
                {application.identification_type}: {application.identification_number}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Información Laboral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Estado Laboral</p>
              <p className="font-semibold">{application.employment_status}</p>
            </div>
            {application.employer_name && (
              <div>
                <p className="text-sm font-medium text-gray-500">Empleador</p>
                <p>{application.employer_name}</p>
              </div>
            )}
            {application.job_title && (
              <div>
                <p className="text-sm font-medium text-gray-500">Puesto</p>
                <p>{application.job_title}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Ingresos Mensuales</p>
              <p className="font-semibold text-green-600">
                {currencyConverter.formatCurrency(
                  application.monthly_income_amount,
                  application.monthly_income_currency,
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Referencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Referencia Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p>{application.personal_reference_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p>{application.personal_reference_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Relación</p>
                  <p>{application.personal_reference_relationship}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Contacto de Emergencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p>{application.emergency_contact_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p>{application.emergency_contact_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Relación</p>
                  <p>{application.emergency_contact_relationship}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Términos Propuestos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
              <p className="font-semibold">{new Date(application.desired_start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duración</p>
              <p>{application.desired_lease_duration_months} meses</p>
            </div>
          </div>
          {application.tenant_notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Comentarios del Solicitante</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{application.tenant_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Owner Actions */}
      {userRole === "OWNER" && application.status === "PENDING" && (
        <Card>
          <CardHeader>
            <CardTitle>Revisión de la Solicitud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="review_notes">Notas de Revisión (Opcional)</Label>
              <Textarea
                id="review_notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Agrega comentarios sobre tu decisión..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onStatusUpdate(application.id, "APPROVED")}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar Solicitud
              </Button>
              <Button
                variant="destructive"
                onClick={() => onStatusUpdate(application.id, "REJECTED")}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar Solicitud
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Owner Notes */}
      {application.owner_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas del Propietario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm bg-blue-50 p-3 rounded-lg">{application.owner_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
