import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const { offerId } = await req.json()

    if (!offerId) {
      return new Response("Missing offerId", { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // 🔐 Auth
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // 🔎 Get offer
    const { data: offer, error } = await supabase
      .from("offers")
      .select("*")
      .eq("id", offerId)
      .single()

    if (error || !offer) {
      return new Response("Offer not found", { status: 404 })
    }

    // 🚨 Ownership check
    if (offer.buyer_id !== user.id) {
      return new Response("Forbidden", { status: 403 })
    }

    // 🚨 Status check
    if (offer.status !== "pending") {
      return new Response("Cannot cancel this offer", { status: 400 })
    }

    // 🔥 Update status
    const { error: updateError } = await supabase
      .from("offers")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", offerId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err) {
    console.error("cancel-offer error:", err)
    return new Response("Server error", { status: 500 })
  }
})