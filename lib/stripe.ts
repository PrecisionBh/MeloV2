import { initStripe } from "@stripe/stripe-react-native"
import Constants from "expo-constants"

let initialized = false

export function ensureStripeInitialized() {
  if (initialized) return

  const key =
    Constants.expoConfig?.extra?.stripePublishableKey

  if (!key) {
    console.warn("Stripe publishable key missing")
    return
  }

  initStripe({
    publishableKey: key,
    // ❌ REMOVED merchantIdentifier (this was triggering Apple Pay)
    urlScheme: "melomp",
  })

  initialized = true
}