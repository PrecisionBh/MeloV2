import { Stack } from "expo-router"
import { useEffect } from "react"

import { initIAP, setupPurchaseListener } from "@/lib/iap"

export default function TabsPlaceholderLayout() {

  useEffect(() => {
    let cleanup: any

    const init = async () => {
      try {
        await initIAP()
        cleanup = setupPurchaseListener()
      } catch (err) {
        console.error("IAP init error:", err)
      }
    }

    init()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}