interface CurrencyConversion {
  originalAmount: number
  convertedAmount: number
  originalCurrency: string
  convertedCurrency: string
  exchangeRate: number
  formattedOriginal: string
  formattedConverted: string
}

class CurrencyConverter {
  private exchangeRates: Record<string, number> = {
    USD: 1,
    MXN: 17.5,
    ARS: 350,
    BRL: 5.2,
    COP: 4200,
    CLP: 850,
    PEN: 3.7,
    GTQ: 7.8,
    CRC: 520,
    UYU: 39,
    BOB: 6.9,
    PYG: 7300,
    DOP: 56,
    HNL: 24.5,
    NIO: 36.8,
    PAB: 1,
    EUR: 0.85,
  }

  private currencySymbols: Record<string, string> = {
    USD: "$",
    MXN: "$",
    ARS: "$",
    BRL: "R$",
    COP: "$",
    CLP: "$",
    PEN: "S/",
    GTQ: "Q",
    CRC: "₡",
    UYU: "$U",
    BOB: "Bs",
    PYG: "₲",
    DOP: "RD$",
    HNL: "L",
    NIO: "C$",
    PAB: "B/.",
    EUR: "€",
  }

  async convertPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    locale = "es-MX",
  ): Promise<CurrencyConversion> {
    // Convertir de centavos a unidades completas
    const originalAmount = amount / 100

    // Si las monedas son iguales, no convertir
    if (fromCurrency === toCurrency) {
      return {
        originalAmount,
        convertedAmount: originalAmount,
        originalCurrency: fromCurrency,
        convertedCurrency: toCurrency,
        exchangeRate: 1,
        formattedOriginal: this.formatCurrency(originalAmount, fromCurrency, locale),
        formattedConverted: this.formatCurrency(originalAmount, toCurrency, locale),
      }
    }

    // Obtener tasas de cambio
    const fromRate = this.exchangeRates[fromCurrency] || 1
    const toRate = this.exchangeRates[toCurrency] || 1

    // Convertir a USD primero, luego a la moneda destino
    const usdAmount = originalAmount / fromRate
    const convertedAmount = usdAmount * toRate
    const exchangeRate = toRate / fromRate

    return {
      originalAmount,
      convertedAmount,
      originalCurrency: fromCurrency,
      convertedCurrency: toCurrency,
      exchangeRate,
      formattedOriginal: this.formatCurrency(originalAmount, fromCurrency, locale),
      formattedConverted: this.formatCurrency(convertedAmount, toCurrency, locale),
    }
  }

  private formatCurrency(amount: number, currency: string, locale: string): string {
    const symbol = this.currencySymbols[currency] || currency

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    } catch (error) {
      // Fallback si la moneda no es soportada por Intl
      return `${symbol}${Math.round(amount).toLocaleString()}`
    }
  }

  getSupportedCurrencies(): Array<{ code: string; name: string; symbol: string }> {
    return [
      { code: "USD", name: "Dólar Estadounidense", symbol: "$" },
      { code: "MXN", name: "Peso Mexicano", symbol: "$" },
      { code: "ARS", name: "Peso Argentino", symbol: "$" },
      { code: "BRL", name: "Real Brasileño", symbol: "R$" },
      { code: "COP", name: "Peso Colombiano", symbol: "$" },
      { code: "CLP", name: "Peso Chileno", symbol: "$" },
      { code: "PEN", name: "Sol Peruano", symbol: "S/" },
      { code: "GTQ", name: "Quetzal Guatemalteco", symbol: "Q" },
      { code: "CRC", name: "Colón Costarricense", symbol: "₡" },
      { code: "EUR", name: "Euro", symbol: "€" },
    ]
  }
}

export const currencyConverter = new CurrencyConverter()
