import { createClient } from "@/lib/supabase/server"

export interface Notification {
  id: string
  title: string
  message: string
  type: "payment" | "contract" | "property" | "system" | "chat"
  read: boolean
  action_url?: string
  metadata: Record<string, any>
  created_at: string
}

export async function getNotifications(userId: string, limit = 20): Promise<Notification[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data || []
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  return !error
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

  return !error
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification["type"],
  actionUrl?: string,
  metadata: Record<string, any> = {},
): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      action_url: actionUrl,
      metadata,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating notification:", error)
    return null
  }

  return data.id
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false)

  if (error) {
    console.error("Error getting unread count:", error)
    return 0
  }

  return count || 0
}
