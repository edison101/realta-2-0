"use client"

import { useState } from "react"
import { supabase, testConnection } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const testSupabaseConnection = async () => {
    setConnectionStatus("testing")
    setError("")
    setData(null)

    try {
      // Probar conexión básica
      const isConnected = await testConnection()

      if (!isConnected) {
        throw new Error("No se pudo conectar a Supabase")
      }

      // Probar consulta a la tabla de monedas
      const { data: currencies, error: currencyError } = await supabase
        .from("currency_rates")
        .select("target_currency, rate, last_updated")
        .limit(5)

      if (currencyError) {
        throw new Error(`Error consultando datos: ${currencyError.message}`)
      }

      // Probar consulta a usuarios (sin datos sensibles)
      const { data: userCount, error: userError } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })

      if (userError) {
        console.warn("Tabla users no disponible:", userError.message)
      }

      setData({
        currencies: currencies || [],
        userCount: userCount || 0,
        timestamp: new Date().toISOString(),
      })

      setConnectionStatus("success")
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Prueba de Conexión Supabase
          {connectionStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {connectionStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
          {connectionStatus === "testing" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        </CardTitle>
        <CardDescription>
          Verifica que la conexión a tu base de datos Supabase esté funcionando correctamente
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button onClick={testSupabaseConnection} disabled={connectionStatus === "testing"} className="w-full">
          {connectionStatus === "testing" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Probando conexión...
            </>
          ) : (
            "Probar Conexión"
          )}
        </Button>

        {connectionStatus === "success" && data && (
          <div className="space-y-3">
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✅ Conexión exitosa
            </Badge>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Datos de prueba:</h4>
              <ul className="text-sm space-y-1">
                <li>• Monedas disponibles: {data.currencies.length}</li>
                <li>• Usuarios registrados: {data.userCount}</li>
                <li>• Última actualización: {new Date(data.timestamp).toLocaleString()}</li>
              </ul>
            </div>

            {data.currencies.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tasas de cambio (muestra):</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {data.currencies.slice(0, 4).map((currency: any) => (
                    <div key={currency.target_currency} className="flex justify-between">
                      <span>{currency.target_currency}:</span>
                      <span>{currency.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="space-y-3">
            <Badge variant="destructive">❌ Error de conexión</Badge>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Error:</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Pasos para solucionar:</h4>
              <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Verifica que las variables de entorno estén configuradas</li>
                <li>Asegúrate de que las tablas existan en Supabase</li>
                <li>Revisa que las claves API sean correctas</li>
                <li>Verifica que RLS esté configurado correctamente</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
