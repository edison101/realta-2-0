import type { Metadata } from "next"
import localFont from "next/font/local"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FloatingWidgets } from "@/components/floating/floating-widgets"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Realta 2.0 - Plataforma Inmobiliaria Global",
  description: "Encuentra y gestiona propiedades en renta en Guatemala y el mundo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingWidgets />
        <Toaster />
      </body>
    </html>
  )
}
