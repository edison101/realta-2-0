import { createClient } from "@/lib/supabase/server"

export interface ChatConversation {
  id: string
  property_id: string
  owner_id: string
  tenant_id: string
  status: "active" | "archived" | "blocked"
  last_message_at: string
  property: {
    title: string
    address: string
  }
  owner: {
    full_name: string
    avatar_url?: string
  }
  tenant: {
    full_name: string
    avatar_url?: string
  }
  unread_count: number
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  message: string
  message_type: "text" | "image" | "file" | "system"
  read: boolean
  metadata: Record<string, any>
  created_at: string
  sender: {
    full_name: string
    avatar_url?: string
  }
}

export async function getConversations(userId: string): Promise<ChatConversation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chat_conversations")
    .select(`
      *,
      property:properties(title, address),
      owner:owner_id(full_name, avatar_url),
      tenant:tenant_id(full_name, avatar_url)
    `)
    .or(`owner_id.eq.${userId},tenant_id.eq.${userId}`)
    .order("last_message_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    return []
  }

  // Obtener conteo de mensajes no leídos para cada conversación
  const conversationsWithUnread = await Promise.all(
    (data || []).map(async (conv) => {
      const { count } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("read", false)
        .neq("sender_id", userId)

      return {
        ...conv,
        unread_count: count || 0,
      }
    }),
  )

  return conversationsWithUnread
}

export async function getMessages(conversationId: string, limit = 50): Promise<ChatMessage[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select(`
      *,
      sender:sender_id(full_name, avatar_url)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return (data || []).reverse()
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  message: string,
  messageType: ChatMessage["message_type"] = "text",
): Promise<ChatMessage | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message,
      message_type: messageType,
    })
    .select(`
      *,
      sender:sender_id(full_name, avatar_url)
    `)
    .single()

  if (error) {
    console.error("Error sending message:", error)
    return null
  }

  // Actualizar timestamp de la conversación
  await supabase
    .from("chat_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId)

  return data
}

export async function createConversation(
  propertyId: string,
  ownerId: string,
  tenantId: string,
): Promise<string | null> {
  const supabase = createClient()

  // Verificar si ya existe una conversación
  const { data: existing } = await supabase
    .from("chat_conversations")
    .select("id")
    .eq("property_id", propertyId)
    .eq("owner_id", ownerId)
    .eq("tenant_id", tenantId)
    .single()

  if (existing) {
    return existing.id
  }

  // Crear nueva conversación
  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      property_id: propertyId,
      owner_id: ownerId,
      tenant_id: tenantId,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating conversation:", error)
    return null
  }

  return data.id
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("chat_messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("read", false)

  return !error
}
