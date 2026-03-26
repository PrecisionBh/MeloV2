import { Platform } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases"

/* ---------------- 🔑 API KEYS ---------------- */

// 👉 ENTER APPLE KEY HERE (starts with appl_)
const IOS_API_KEY = "appl_cqNynDXinxFdKAFTAAKpKGzkfaJ"

// 👉 ENTER GOOGLE KEY HERE (starts with goog_)
const ANDROID_API_KEY = "goog_bKCCIFTBHjriIpZdxQHiuQdMesp"

/* ---------------- INIT ---------------- */

export async function initRevenueCat(userId?: string) {
  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG)

    const apiKey =
      Platform.OS === "ios" ? IOS_API_KEY : ANDROID_API_KEY

    await Purchases.configure({
      apiKey,
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

/* ---------------- PURCHASE ---------------- */

export async function purchasePackage(pkg: any) {
  try {
    console.log("💳 Purchasing package:", pkg?.identifier)

    const { customerInfo } = await Purchases.purchasePackage(pkg)

    console.log("✅ Purchase successful:", customerInfo)

    return customerInfo
  } catch (err: any) {
    if (err?.userCancelled) {
      console.log("⚠️ User cancelled purchase")
    } else {
      console.error("❌ Purchase error:", err)
    }
    return null
  }
}

/* ---------------- RESTORE PURCHASES ---------------- */

export async function restorePurchases() {
  try {
    console.log("🔄 Restoring purchases...")

    const customerInfo = await Purchases.restorePurchases()

    console.log("✅ Restored:", customerInfo)

    return customerInfo
  } catch (err) {
    console.error("❌ Restore error:", err)
    return null
  }
}