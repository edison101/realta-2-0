"use client"

import { useState } from "react"
import { supabase, testConnection, checkAuthStatus } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Loader2, Database, Users, CreditCard, Building, TrendingUp } from "lucide-react"

interface TableStatus {
  table: string
  exists: boolean
  count?: number
  error?: string
}

export function ConnectionDashboard() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([])
  const [sampleData, setSampleData] = useState<any>({})
  const [error, setError] = useState<string>("")

  const runFullDiagnostic = async () => {
    setConnectionStatus("testing")
    setError("")
    setTableStatuses([])
    setSampleData({})

    try {
      // 1. Probar conexión básica
      console.log("🔄 Paso 1: Probando conexión básica...")
      const connectionResult = await testConnection()

      if (!connectionResult.success) {
        throw new Error(`Conexión fallida: ${connectionResult.error}`)
      }

      // 2. Verificar estado de autenticación
      console.log("🔄 Paso 2: Verificando autenticación...")
      const session = await checkAuthStatus()
      setAuthStatus(session)

      // 3. Verificar tablas
      console.log("🔄 Paso 3: Verificando tablas...")
      const tables = ["users", "properties", "contracts", "transactions", "currency_rates"]
      const tableResults: TableStatus[] = []

      for (const table of tables) {
        try {
          const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true })

          if (error) {
            tableResults.push({ table, exists: false, error: error.message })
          } else {
            tableResults.push({ table, exists: true, count: count || 0 })
          }
        } catch (err: any) {
          tableResults.push({ table, exists: false, error: err.message })
        }
      }

      setTableStatuses(tableResults)

      // 4. Obtener datos de muestra
      console.log("🔄 Paso 4: Obteniendo datos de muestra...")
      const sampleQueries = await Promise.allSettled([
        supabase.from("currency_rates").select("target_currency, rate").limit(5),
        supabase.from("properties").select("title, city, country, price_currency").limit(3),
        supabase.from("users").select("country_code, preferred_currency").limit(3),
      ])

      const samples: any = {}
      if (sampleQueries[0].status === "fulfilled" && sampleQueries[0].value.data) {
        samples.currencies = sampleQueries[0].value.data
      }
      if (sampleQueries[1].status === "fulfilled" && sampleQueries[1].value.data) {
        samples.properties = sampleQueries[1].value.data
      }
      if (sampleQueries[2].status === "fulfilled" && sampleQueries[2].value.data) {
        samples.users = sampleQueries[2].value.data
      }

      setSampleData(samples)
      setConnectionStatus("success")
      console.log("✅ Diagnóstico completo exitoso")
    } catch (err: any) {
      console.error("❌ Error en diagnóstico:", err.message)
      setError(err.message)
      setConnectionStatus("error")
    }
  }

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case "users":
        return <Users className="h-4 w-4" />
      case "properties":
        return <Building className="h-4 w-4" />
      case "contracts":
        return <CreditCard className="h-4 w-4" />
      case "transactions":
        return <TrendingUp className="h-4 w-4" />
      case "currency_rates":
        return <Database className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Panel de Diagnóstico Supabase
            {connectionStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {connectionStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
            {connectionStatus === "testing" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
          </CardTitle>
          <CardDescription>Diagnóstico completo de la conexión y configuración de Realta 2.0</CardDescription>
        </CardHeader>

        <CardContent>
          <Button onClick={runFullDiagnostic} disabled={connectionStatus === "testing"} className="w-full" size="lg">
            {connectionStatus === "testing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando diagnóstico completo...
              </>
            ) : (
              "🚀 Ejecutar Diagnóstico Completo"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {connectionStatus !== "idle" && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="tables">Tablas</TabsTrigger>
            <TabsTrigger value="data">Datos</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado General</CardTitle>
              </CardHeader>
              <CardContent>
                {connectionStatus === "success" && (
                  <div className="space-y-3">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✅ Conexión exitosa a Supabase
                    </Badge>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {tableStatuses.filter((t) => t.exists).length}
                        </div>
                        <div className="text-sm text-gray-600">Tablas OK</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {tableStatuses.reduce((sum, t) => sum + (t.count || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Registros</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{sampleData.currencies?.length || 0}</div>
                        <div className="text-sm text-gray-600">Monedas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{authStatus ? "Activo" : "Inactivo"}</div>
                        <div className="text-sm text-gray-600">Auth</div>
                      </div>
                    </div>
                  </div>
                )}

                {connectionStatus === "error" && (
                  <div className="space-y-3">
                    <Badge variant="destructive">❌ Error de conexión</Badge>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid gap-4">
              {tableStatuses.map((table) => (
                <Card key={table.table}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {getTableIcon(table.table)}
                      <div>
                        <h4 className="font-medium capitalize">{table.table}</h4>
                        {table.error && <p className="text-sm text-red-600">{table.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {table.exists ? (
                        <>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {table.count} registros
                          </Badge>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </>
                      ) : (
                        <>
                          <Badge variant="destructive">Error</Badge>
                          <XCircle className="h-5 w-5 text-red-500" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {sampleData.currencies && (
              <Card>
                <CardHeader>
                  <CardTitle>Tasas de Cambio (Muestra)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sampleData.currencies.map((currency: any) => (
                      <div key={currency.target_currency} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{currency.target_currency}</span>
                        <span>{currency.rate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sampleData.properties && (
              <Card>
                <CardHeader>
                  <CardTitle>Propiedades (Muestra)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleData.properties.map((property: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{property.title}</span>
                        <span className="text-sm text-gray-600">
                          {property.city}, {property.country} ({property.price_currency})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Autenticación</CardTitle>
              </CardHeader>
              <CardContent>
                {authStatus ? (
                  <div className="space-y-2">
                    <Badge variant="default">Sesión activa</Badge>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(authStatus, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="secondary">Sin sesión activa</Badge>
                    <p className="text-sm text-gray-600">No hay usuario autenticado actualmente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
