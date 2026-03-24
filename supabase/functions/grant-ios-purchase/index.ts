import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const { productId } = await req.json()

    if (!productId) {
      return new Response("Missing productId", { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // 🔐 Auth user
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response("Invalid user", { status: 401 })
    }

    // 🔎 Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "boosts_remaining, mega_boosts_remaining, is_pro, pro_activated_at"
      )
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      throw new Error("Profile fetch failed")
    }

    let boosts = profile.boosts_remaining ?? 0
    let mega = profile.mega_boosts_remaining ?? 0
    let isPro = profile.is_pro ?? false

    const now = new Date()
    const nowIso = now.toISOString()

    const nextMonth = new Date(now)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthIso = nextMonth.toISOString()

    // 🧠 FIRST TIME PRO CHECK
    const isFirstActivation = !profile.pro_activated_at

    // 🔥 MAIN LOGIC (MATCHES STRIPE EXACTLY)
    switch (productId) {
      case "boost_pack_3":
        boosts += 3
        break

      case "boost_pack_10":
        boosts += 10
        break

      case "boost_pack_25":
        boosts += 25
        break

      case "mega_boost_1":
        mega += 1
        break

      case "mega_boost_3":
        mega += 3
        break

      case "mega_boost_8":
        mega += 8
        break

      case "melo_pro_subscription":
        isPro = true

        if (isFirstActivation) {
          boosts += 5
          mega += 1
        }

        break

      default:
        return new Response("Invalid productId", { status: 400 })
    }

    // 🔥 UPDATE PROFILE (STACKING SAFE)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        boosts_remaining: boosts,
        mega_boosts_remaining: mega,
        is_pro: isPro,
        pro_activated_at: profile.pro_activated_at || nowIso,
        pro_expires_at: isPro ? nextMonthIso : null,
        updated_at: nowIso,
      })
      .eq("id", user.id)

    if (updateError) {
      throw updateError
    }

    console.log("✅ iOS purchase granted", {
      userId: user.id,
      productId,
      boosts,
      mega,
      isPro,
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err) {
    console.error("❌ grant_ios_purchase error:", err)
    return new Response("Server error", { status: 500 })
  }
})