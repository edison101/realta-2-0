"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageCircle, Phone, Mail, ArrowUp, Headphones, X } from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat/chat-widget"

export function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const contactOptions = [
    {
      icon: Phone,
      label: "Llamar",
      href: "tel:+50223456789",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:soporte@realta.com",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Headphones,
      label: "Soporte",
      href: "/ayuda",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={scrollToTop}
                size="sm"
                className="rounded-full w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Ir arriba</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Contact Options */}
        <div className="flex flex-col space-y-2">
          {contactOptions.map((option, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="sm"
                  className={`rounded-full w-12 h-12 ${option.color} text-white shadow-lg transition-all duration-200 hover:scale-110`}
                >
                  <Link href={option.href}>
                    <option.icon className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{option.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Chat Widget */}
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowChat(!showChat)}
                size="sm"
                className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg relative transition-all duration-200 hover:scale-110"
              >
                {showChat ? (
                  <X className="h-6 w-6" />
                ) : (
                  <>
                    <MessageCircle className="h-6 w-6" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{showChat ? "Cerrar chat" : "Abrir chat"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Chat Widget Panel */}
          {showChat && (
            <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border animate-fade-in">
              <ChatWidget onClose={() => setShowChat(false)} />
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span className="font-medium">Emergencias: 911</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
