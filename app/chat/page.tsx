"use client"

import { useState } from "react"
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para conversaciones
const conversations = [
  {
    id: "1",
    participant: {
      name: "María González",
      avatar: "/placeholder.svg?height=40&width=40&text=MG",
      online: true,
      lastSeen: "Ahora",
    },
    property: {
      title: "Apartamento Zona 10",
      image: "/placeholder.svg?height=40&width=40&text=Apt",
    },
    lastMessage: {
      text: "¿Podríamos agendar una visita para mañana?",
      time: "10:30 AM",
      unread: 2,
      sender: "them",
    },
  },
  {
    id: "2",
    participant: {
      name: "Carlos Mendoza",
      avatar: "/placeholder.svg?height=40&width=40&text=CM",
      online: false,
      lastSeen: "Hace 2 horas",
    },
    property: {
      title: "Casa en Las Condes",
      image: "/placeholder.svg?height=40&width=40&text=Casa",
    },
    lastMessage: {
      text: "Perfecto, nos vemos el viernes",
      time: "Ayer",
      unread: 0,
      sender: "me",
    },
  },
  {
    id: "3",
    participant: {
      name: "Ana Rodríguez",
      avatar: "/placeholder.svg?height=40&width=40&text=AR",
      online: true,
      lastSeen: "Ahora",
    },
    property: {
      title: "Estudio en Palermo",
      image: "/placeholder.svg?height=40&width=40&text=Est",
    },
    lastMessage: {
      text: "Los documentos están listos",
      time: "2:15 PM",
      unread: 1,
      sender: "them",
    },
  },
]

// Mensajes de ejemplo para la conversación activa
const messages = [
  {
    id: "1",
    text: "Hola, me interesa mucho tu apartamento en Zona 10",
    time: "10:00 AM",
    sender: "me",
    status: "read",
  },
  {
    id: "2",
    text: "¡Hola! Me da mucho gusto saber de tu interés. ¿Te gustaría agendar una visita?",
    time: "10:05 AM",
    sender: "them",
    status: "delivered",
  },
  {
    id: "3",
    text: "Sí, me encantaría. ¿Qué días tienes disponibles esta semana?",
    time: "10:10 AM",
    sender: "me",
    status: "read",
  },
  {
    id: "4",
    text: "Tengo disponibilidad mañana por la tarde o el viernes por la mañana. ¿Cuál te conviene más?",
    time: "10:15 AM",
    sender: "them",
    status: "delivered",
  },
  {
    id: "5",
    text: "¿Podríamos agendar una visita para mañana?",
    time: "10:30 AM",
    sender: "them",
    status: "sent",
  },
]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      console.log("Enviando mensaje:", newMessage)
      setNewMessage("")
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Lista de conversaciones */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold mb-3">Mensajes</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation.id === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={conversation.participant.avatar || "/placeholder.svg"}
                      alt={conversation.participant.name}
                    />
                    <AvatarFallback>
                      {conversation.participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.participant.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">{conversation.property.title}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate flex-1">
                      {conversation.lastMessage.sender === "me" ? "Tú: " : ""}
                      {conversation.lastMessage.text}
                    </p>
                    {conversation.lastMessage.unread > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs ml-2">{conversation.lastMessage.unread}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={selectedConversation.participant.avatar || "/placeholder.svg"}
                        alt={selectedConversation.participant.name}
                      />
                      <AvatarFallback>
                        {selectedConversation.participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.participant.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.participant.online ? "En línea" : selectedConversation.participant.lastSeen}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Información de la propiedad */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation.property.image || "/placeholder.svg"}
                    alt={selectedConversation.property.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{selectedConversation.property.title}</p>
                    <p className="text-xs text-gray-500">Conversación sobre esta propiedad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "me" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`flex items-center justify-between mt-1 ${
                        message.sender === "me" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      <span className="text-xs">{message.time}</span>
                      {message.sender === "me" && (
                        <span className="text-xs">
                          {message.status === "sent" && "✓"}
                          {message.status === "delivered" && "✓✓"}
                          {message.status === "read" && "✓✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecciona una conversación</h3>
              <p className="text-gray-600">Elige una conversación para comenzar a chatear</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
