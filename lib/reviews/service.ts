import { createClient } from "@/lib/supabase/server"

export interface Review {
  id: string
  property_id: string
  reviewer_id: string
  contract_id?: string
  rating: number
  title: string
  comment: string
  review_type: "property" | "owner" | "tenant"
  is_verified: boolean
  helpful_count: number
  created_at: string
  reviewer: {
    full_name: string
    avatar_url?: string
  }
  is_helpful?: boolean
}

export async function getPropertyReviews(propertyId: string, limit = 20): Promise<Review[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id(full_name, avatar_url)
    `)
    .eq("property_id", propertyId)
    .eq("review_type", "property")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function createReview(
  propertyId: string,
  reviewerId: string,
  rating: number,
  title: string,
  comment: string,
  reviewType: Review["review_type"] = "property",
  contractId?: string,
): Promise<Review | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      property_id: propertyId,
      reviewer_id: reviewerId,
      contract_id: contractId,
      rating,
      title,
      comment,
      review_type: reviewType,
      is_verified: !!contractId, // Verificado si tiene contrato
    })
    .select(`
      *,
      reviewer:reviewer_id(full_name, avatar_url)
    `)
    .single()

  if (error) {
    console.error("Error creating review:", error)
    return null
  }

  return data
}

export async function markReviewAsHelpful(reviewId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  // Verificar si ya marcó como útil
  const { data: existing } = await supabase
    .from("review_helpful")
    .select("id")
    .eq("review_id", reviewId)
    .eq("user_id", userId)
    .single()

  if (existing) {
    // Quitar marca de útil
    const { error } = await supabase.from("review_helpful").delete().eq("id", existing.id)

    if (!error) {
      // Decrementar contador
      await supabase.rpc("decrement_helpful_count", { review_id: reviewId })
    }

    return !error
  } else {
    // Marcar como útil
    const { error } = await supabase.from("review_helpful").insert({
      review_id: reviewId,
      user_id: userId,
    })

    if (!error) {
      // Incrementar contador
      await supabase.rpc("increment_helpful_count", { review_id: reviewId })
    }

    return !error
  }
}

export async function getReviewStats(propertyId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("property_id", propertyId)
    .eq("review_type", "property")

  if (error) {
    console.error("Error fetching review stats:", error)
    return {
      average: 0,
      total: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  const reviews = data || []
  const total = reviews.length
  const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0

  const distribution = reviews.reduce(
    (acc, r) => {
      acc[r.rating as keyof typeof acc]++
      return acc
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  )

  return { average, total, distribution }
}
