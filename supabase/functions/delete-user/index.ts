import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    console.log("🧨 Deleting user:", user_id)

    /* ---------------- DELETE USER DATA ---------------- */

    // 🔥 Delete profile
    await supabase.from("profiles").delete().eq("id", user_id)

    // 🔥 Delete listings
    await supabase.from("listings").delete().eq("user_id", user_id)

    // 🔥 Delete messages
    await supabase.from("messages").delete().or(`sender_id.eq.${user_id}`)

    // 🔥 Delete notifications
    await supabase.from("notifications").delete().eq("user_id", user_id)

    // 🔥 Delete orders (optional — safer to keep for records)
    // await supabase.from("orders").delete().or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)

    // 🔥 Delete wallet (if you have one)
    await supabase.from("wallets").delete().eq("user_id", user_id)

    /* ---------------- DELETE AUTH USER ---------------- */

    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(user_id)

    if (deleteError) {
      console.error("❌ Auth delete failed:", deleteError)
      throw deleteError
    }

    console.log("✅ User fully deleted")

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    console.error("🔥 Delete user error:", err)

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
})