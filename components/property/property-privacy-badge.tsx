"use client"

import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Lock, Globe, Home, UserCheck } from "lucide-react"

interface PropertyPrivacyBadgeProps {
  visibility: "PUBLIC" | "PRIVATE" | "DRAFT"
  rentalStatus: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE"
  className?: string
}

export function PropertyPrivacyBadge({ visibility, rentalStatus, className }: PropertyPrivacyBadgeProps) {
  const getBadgeConfig = () => {
    if (rentalStatus === "RENTED") {
      return {
        icon: Lock,
        text: "Alquilada",
        variant: "secondary" as const,
        className: "bg-red-100 text-red-800 border-red-200",
      }
    }

    if (rentalStatus === "RESERVED") {
      return {
        icon: UserCheck,
        text: "Reservada",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      }
    }

    if (rentalStatus === "MAINTENANCE") {
      return {
        icon: Home,
        text: "Mantenimiento",
        variant: "secondary" as const,
        className: "bg-orange-100 text-orange-800 border-orange-200",
      }
    }

    if (visibility === "PUBLIC") {
      return {
        icon: Globe,
        text: "Disponible",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-200",
      }
    }

    if (visibility === "PRIVATE") {
      return {
        icon: EyeOff,
        text: "Privada",
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      }
    }

    return {
      icon: Eye,
      text: "Borrador",
      variant: "outline" as const,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    }
  }

  const config = getBadgeConfig()
  const IconComponent = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <IconComponent className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  )
}
