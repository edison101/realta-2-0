"use client"

import { useState, useEffect } from "react"
import { ApplicationManagement } from "@/components/contracts/application-management"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ApplicationsPage({ params }: { params: { locale: string } }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"OWNER" | "TENANT">("TENANT")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/rental-applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)

        // Determinar el rol del usuario basado en las solicitudes
        if (data.applications.length > 0) {
          const firstApp = data.applications[0]
          setUserRole(firstApp.owner_id ? "OWNER" : "TENANT")
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/rental-applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, owner_notes: notes }),
      })

      if (response.ok) {
        // Refrescar la lista de solicitudes
        await fetchApplications()
      } else {
        throw new Error("Error updating application")
      }
    } catch (error) {
      console.error("Error updating application:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Cargando solicitudes...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicationManagement
          applications={applications}
          userRole={userRole}
          locale={params.locale}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  )
}
