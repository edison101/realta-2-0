"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChatMessage } from "@/lib/chat/service"

interface ChatWidgetProps {
  conversationId?: string
  propertyId?: string
  ownerId?: string
  tenantId?: string
}

function ChatWidget({ conversationId, propertyId, ownerId, tenantId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState(conversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && currentConversationId) {
      fetchMessages()
    }
  }, [isOpen, currentConversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    if (!currentConversationId) return

    try {
      const response = await fetch(`/api/chat/conversations/${currentConversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const createConversation = async () => {
    if (!propertyId || !ownerId || !tenantId) return null

    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          ownerId,
          tenantId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.conversationId
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
    }

    return null
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    let convId = currentConversationId

    // Crear conversación si no existe
    if (!convId) {
      convId = await createConversation()
      if (!convId) return
      setCurrentConversationId(convId)
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/chat/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Chat</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender_id === "current-user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender_id !== "current-user" && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={message.sender.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {message.sender.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      message.sender_id === "current-user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === "current-user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !newMessage.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export { ChatWidget }
export default ChatWidget
