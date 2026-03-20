/// <reference lib="deno.ns" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno"

console.log("🚀 create-boost-checkout booted")

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
})

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const PRICE_MAP: Record<string, string> = {
  boost_3: "price_1TBlobDaisGHVOvP55rcOXmZ",
  boost_10: "price_1TBlobDaisGHVOvPsuDCQW9e",
  boost_25: "price_1TBlodDaisGHVOvP7CrM4Iba",
  mega_1: "price_1TBlodDaisGHVOvPWyNq9D3l",
  mega_3: "price_1TBlobDaisGHVOvPUx0Kx0QI",
  mega_8: "price_1TBlobDaisGHVOvPr7nhCVlj",
}

Deno.serve(async (req) => {
  try {
    console.log("🔥 Function invoked")

    const body = await req.json()
    console.log("📦 Body:", body)

    const { userId, packageId } = body

    if (!userId || !packageId) {
      return new Response(
        JSON.stringify({ error: "Missing userId or packageId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const priceId = PRICE_MAP[packageId]

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Invalid packageId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // 🔍 Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id, email")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.error("❌ Profile lookup failed:", profileError)
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    let customerId = profile.stripe_customer_id

    // 🔥 STEP 1: Validate existing customer (FIXES YOUR ERROR)
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId)
        console.log("✅ Existing Stripe customer is valid:", customerId)
      } catch (err: any) {
        console.log("⚠ Invalid Stripe customer, will recreate:", customerId)
        customerId = null
      }
    }

    // 🔥 STEP 2: Create if missing OR invalid
    if (!customerId) {
      console.log("⚠ Creating new Stripe customer...")

      const customer = await stripe.customers.create({
        email: profile.email ?? undefined,
        metadata: {
          user_id: userId,
        },
      })

      customerId = customer.id

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId)

      console.log("✅ Stripe customer created + saved:", customerId)
    }

    // 🔥 STEP 3: Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://stripe.com",
      cancel_url: "https://stripe.com",
      metadata: {
        type: "boost_pack",
        user_id: userId,
        package_id: packageId,
      },
    })

    console.log("✅ Stripe session created:", session.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error: any) {
    console.error("❌ Checkout creation failed:", error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
})