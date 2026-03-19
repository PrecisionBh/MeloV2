/// <reference lib="deno.ns" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno"

console.log("🚀 auto_refund_returns_v2 booted")

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
})

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const CRON_SECRET = Deno.env.get("CRON_SECRET")

Deno.serve(async (req) => {
  const headerSecret = req.headers.get("x-cron-secret")

  if (!CRON_SECRET || headerSecret !== CRON_SECRET) {
    console.warn("❌ Unauthorized auto return refund attempt")
    return new Response("Unauthorized", { status: 401 })
  }

  console.log("🔎 Checking eligible return refunds...")

  const now = new Date().toISOString()
  console.log("🧪 CURRENT TIME:", now)

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "return_started")
    .eq("is_disputed", false)
    .eq("return_received", false)
    .eq("escrow_released", false)
    .eq("escrow_status", "held")
    .eq("return_tracking_status", "delivered") // 🔥 MUST BE DELIVERED
    .not("return_refund_at", "is", null)
    .lte("return_refund_at", now)

  if (error) {
    console.error("❌ Fetch failed:", error)
    return new Response("Error", { status: 500 })
  }

  if (!orders?.length) {
    console.log("🚫 No eligible return refunds")
    return Response.json({ processed: 0 })
  }

  console.log(`📦 Found ${orders.length} return refunds`)

  let processed = 0

  for (const order of orders) {
    try {
      console.log("↩️ Processing return refund:", order.id)

      if (!order.stripe_payment_intent) {
        console.warn("⚠️ Missing payment intent:", order.id)
        continue
      }

      const refund = await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent,
        amount: order.amount_cents,
        metadata: {
          order_id: order.id,
          reason: "auto_return_delivery_timeout",
        },
      })

      console.log("✅ Stripe refund:", refund.id)

      const { error: rpcError } = await supabase.rpc(
        "return_order_refund",
        {
          p_order_id: order.id,
          p_stripe_refund_id: refund.id,
        }
      )

      if (rpcError) {
        console.error("❌ RPC failed:", rpcError)
        continue
      }

      processed++
      console.log("🎉 Return auto-refunded:", order.id)

    } catch (err) {
      console.error("❌ Order error:", order.id, err)
    }
  }

  console.log("🏁 FINAL PROCESSED:", processed)

  return Response.json({ processed })
})