import { supabase } from "@/lib/supabase"
import * as IAP from "expo-iap"

/* ---------------- PRODUCTS ---------------- */

export const productIds = [
  "boost_pack_3",
  "boost_pack_10",
  "boost_pack_25",
  "mega_boost_1",
  "mega_boost_3",
  "mega_boost_8",
  "melo_pro_subscription",
]

/* ---------------- INIT ---------------- */

export const initIAP = async () => {
  try {
    await IAP.initConnection()

    const products = await (IAP as any).fetchProducts({
      skus: productIds,
    })

    console.log("🛒 PRODUCTS:", products)

    return products || []
  } catch (err) {
    console.error("IAP init error:", err)
    return []
  }
}

/* ---------------- PURCHASE ---------------- */

export const purchaseItem = async (productId: string) => {
  try {
    await (IAP as any).requestPurchase({
      sku: productId,
    })
  } catch (err) {
    console.error("Purchase error:", err)
    throw err
  }
}

/* ---------------- LISTENER ---------------- */

export const setupPurchaseListener = () => {
  const purchaseListener = IAP.purchaseUpdatedListener(async (purchase: any) => {
    try {
      const productId = purchase?.productId
      const receipt = purchase?.transactionReceipt

      if (!productId || !receipt) return

      const { error } = await supabase.functions.invoke(
        "grant-ios-purchase",
        {
          body: {
            productId,
            receipt,
          },
        }
      )

      if (error) {
        console.error("Grant failed:", error)
        return
      }

      console.log("✅ Purchase granted:", productId)

      await (IAP as any).finishTransaction({
        purchase,
        isConsumable: true,
      })
    } catch (err) {
      console.error("Purchase handling error:", err)
    }
  })

  const errorListener = IAP.purchaseErrorListener((error: any) => {
    console.error("Purchase error:", error)
  })

  return () => {
    purchaseListener.remove()
    errorListener.remove()
  }
}

/* ---------------- CLEANUP ---------------- */

export const disconnectIAP = async () => {
  try {
    await IAP.endConnection()
  } catch (err) {
    console.error("IAP disconnect error:", err)
  }
}