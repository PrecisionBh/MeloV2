/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const EASYPOST_API_KEY = Deno.env.get("EASYPOST_API_KEY")!

// 🔥 Status mapping
const mapStatus = (status: string) => {
  const s = status?.toLowerCase().trim()

  if (s === "pre_transit") return "label_created"

  if (
    s === "in_transit" ||
    s === "out_for_delivery" ||
    s === "available_for_pickup"
  ) return "in_transit"

  if (s === "delivered") return "delivered"

  if (
    s === "failure" ||
    s === "return_to_sender" ||
    s === "cancelled"
  ) return "exception"

  console.log("⚠️ UNKNOWN STATUS:", status)
  return "label_created"
}

serve(async (req) => {
  try {
    console.log("🚀 check-tracking started")

    // 🧠 Detect UI vs CRON
    const body = await req.json().catch(() => null)
    const orderId = body?.orderId

    let orders: any[] = []

    if (orderId) {
      // 🟢 UI MODE (single order)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single()

      if (error || !data) {
        console.log("❌ Order fetch error:", error)
        return new Response("Order not found", { status: 404 })
      }

      orders = [data]
    } else {
      // 🔵 CRON MODE (bulk orders)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .not("tracking_number", "is", null)
        .neq("tracking_status", "delivered") // 🛑 stop re-checking delivered

      if (error) {
        console.log("❌ FETCH ERROR:", error)
        return new Response("Fetch failed", { status: 500 })
      }

      orders = data || []
      console.log(`📦 Cron checking ${orders.length} orders`)
    }

    for (const order of orders) {
      try {
        if (!order.tracking_number) continue

        console.log("📦 Checking:", order.tracking_number)

        // 🔥 Create / fetch tracker from EasyPost
        const res = await fetch("https://api.easypost.com/v2/trackers", {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${EASYPOST_API_KEY}:`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tracker: {
              tracking_code: order.tracking_number,
            },
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          console.log("❌ EasyPost error:", data)
          continue
        }

        const tracker = data.tracker || data

        if (!tracker?.status) {
          console.log("⚠️ No status returned")
          continue
        }

        const easyPostStatus = tracker.status
        const newStatus = mapStatus(easyPostStatus)
        const publicUrl = tracker.public_url || null

        console.log("📦 EasyPost:", easyPostStatus, "→", newStatus)
        console.log("🔗 Public URL:", publicUrl)

        // 🔥 DELIVERY LOGIC
        let deliveredAt = order.delivered_at
        let escrowReleaseAt = order.escrow_release_at

        if (newStatus === "delivered" && !order.delivered_at) {
          const now = new Date()

          deliveredAt = now.toISOString()
          escrowReleaseAt = new Date(
            now.getTime() + 2 * 24 * 60 * 60 * 1000
          ).toISOString()

          console.log("🎉 DELIVERY DETECTED → TIMER STARTED", order.id)
        }

        // 🔥 UPDATE OBJECT
        const updateData: any = {
          tracking_status: newStatus,
          delivered_at: deliveredAt,
          escrow_release_at: escrowReleaseAt,
          updated_at: new Date().toISOString(),
        }

        // 🔥 Only update tracking URL if provided
        if (publicUrl && publicUrl !== order.tracking_url) {
          updateData.tracking_url = publicUrl
        }

        await supabase
          .from("orders")
          .update(updateData)
          .eq("id", order.id)

      } catch (err) {
        console.log("❌ Order error:", order.id, err)
      }
    }

    return new Response("Done", { status: 200 })

  } catch (err) {
    console.log("❌ Fatal error:", err)
    return new Response("Server error", { status: 500 })
  }
})