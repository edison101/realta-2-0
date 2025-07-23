"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { CurrencySelector } from "@/components/currency/currency-selector"
import { createClient } from "@/lib/supabase/client"
import { Menu, Home, Search, Building, User, LogOut, Settings, PlusCircle, MessageSquare, FileText } from "lucide-react"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Propiedades", href: "/propiedades", icon: Building },
    { name: "Buscar", href: "/buscar", icon: Search },
  ]

  const userNavigation = user
    ? [
        { name: "Dashboard", href: "/dashboard", icon: User },
        { name: "Mis Propiedades", href: "/dashboard/propiedades", icon: Building },
        { name: "Contratos", href: "/dashboard/contratos", icon: FileText },
        { name: "Mensajes", href: "/chat", icon: MessageSquare },
        { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
      ]
    : []

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Realta</span>
            <Badge variant="secondary" className="text-xs">
              2.0
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <CurrencySelector />

            {user ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Add Property Button */}
                <Button asChild size="sm" className="hidden md:flex">
                  <Link href="/dashboard/propiedades/nueva">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Publicar
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <User className="h-4 w-4" />
                      <span className="sr-only">Abrir menú de usuario</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">Usuario verificado</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userNavigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-primary hover:bg-accent"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {user && (
                    <>
                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          {userNavigation.map((item) => {
                            const Icon = item.icon
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                              >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="w-full justify-start bg-transparent"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar sesión
                        </Button>
                      </div>
                    </>
                  )}

                  {!user && (
                    <div className="border-t pt-4 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full bg-transparent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/login">Iniciar sesión</Link>
                      </Button>
                      <Button size="sm" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Link href="/registro">Registrarse</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
