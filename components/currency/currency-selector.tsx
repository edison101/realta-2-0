"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, DollarSign } from "lucide-react"

const currencies = [
  { code: "USD", name: "Dólar Estadounidense", symbol: "$", flag: "🇺🇸" },
  { code: "GTQ", name: "Quetzal Guatemalteco", symbol: "Q", flag: "🇬🇹" },
  { code: "MXN", name: "Peso Mexicano", symbol: "$", flag: "🇲🇽" },
  { code: "ARS", name: "Peso Argentino", symbol: "$", flag: "🇦🇷" },
  { code: "BRL", name: "Real Brasileño", symbol: "R$", flag: "🇧🇷" },
  { code: "COP", name: "Peso Colombiano", symbol: "$", flag: "🇨🇴" },
  { code: "CLP", name: "Peso Chileno", symbol: "$", flag: "🇨🇱" },
  { code: "PEN", name: "Sol Peruano", symbol: "S/", flag: "🇵🇪" },
  { code: "CRC", name: "Colón Costarricense", symbol: "₡", flag: "🇨🇷" },
  { code: "UYU", name: "Peso Uruguayo", symbol: "$", flag: "🇺🇾" },
]

interface CurrencySelectorProps {
  currentCurrency: string
}

function CurrencySelectorInner({ currentCurrency }: CurrencySelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const selectedCurrency = currencies.find((c) => c.code === currentCurrency) || currencies[0]

  const handleCurrencyChange = (currencyCode: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("currency", currencyCode)
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[140px] bg-transparent">
          <DollarSign className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>{selectedCurrency.flag}</span>
            <span>{selectedCurrency.code}</span>
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{currency.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{currency.code}</span>
              <span className="text-sm text-gray-500">{currency.name}</span>
            </div>
            {currency.code === currentCurrency && <span className="ml-auto text-blue-600">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CurrencySelector({ currentCurrency }: CurrencySelectorProps) {
  return (
    <Suspense fallback={<div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse"></div>}>
      <CurrencySelectorInner currentCurrency={currentCurrency} />
    </Suspense>
  )
}
