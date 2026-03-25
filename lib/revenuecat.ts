import Purchases, { LOG_LEVEL } from "react-native-purchases"

const API_KEY = "test_gwuFbfyFHHJlNeqPxDmmkYNqFpm"

/* ---------------- INIT ---------------- */

export async function initRevenueCat(userId?: string) {
  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG)

    await Purchases.configure({
      apiKey: API_KEY,
      appUserID: userId ?? null,
    })

    console.log("✅ RevenueCat initialized")
  } catch (err) {
    console.error("❌ RevenueCat init error:", err)
  }
}

/* ---------------- GET OFFERINGS ---------------- */

export async function getOfferings() {
  try {
    console.log("📦 Fetching RevenueCat offerings...")

    const offerings = await Purchases.getOfferings()

    console.log("📦 FULL OFFERINGS:", offerings)

    if (!offerings.current) {
      console.warn("⚠️ No current offering found")
      return null
    }

    console.log(
      "✅ Current offering packages:",
      offerings.current.availablePackages
    )

    return offerings.current
  } catch (err) {
    console.error("❌ getOfferings error:", err)
    return null
  }
}