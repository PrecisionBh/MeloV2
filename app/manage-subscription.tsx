import { Ionicons } from "@expo/vector-icons"
import * as Linking from "expo-linking"
import { useRouter } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"
import { handleAppError } from "@/lib/errors/appError"
import { supabase } from "@/lib/supabase"

export default function ManageSubscriptionScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const openBillingPortal = async () => {
    try {
      setLoading(true) // 🔥 Show spinner immediately

      // Deep link back into app (matches your existing checkout pattern)
      const returnUrl = Linking.createURL("/melo-pro/dashboard")

      const { data, error } = await supabase.functions.invoke(
        "create-billing-portal-session",
        {
          body: { returnUrl },
        }
      )

      if (error) {
        console.error("❌ Billing portal invoke error:", error)
        throw error
      }

      if (!data?.url) {
        throw new Error("No billing portal URL returned")
      }

      // Opens Stripe customer portal (cancel, update card, invoices)
      await WebBrowser.openBrowserAsync(data.url)
    } catch (err: any) {
      console.error("❌ Open billing portal failed:", err)
      handleAppError(err)
      Alert.alert(
        "Subscription Error",
        "We couldn't open the subscription manager. Please try again."
      )
    } finally {
      setLoading(false) // 🔥 Always stop spinner
    }
  }

  return (
    <View style={styles.container}>
      {/* Global Header (unchanged as requested) */}
      <AppHeader title="Manage Subscription" />

      {/* Custom Back Row (Melo-safe navigation) */}
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => router.push("/seller-hub")}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={18} color="#0F1E17" />
        <Text style={styles.backText}>Back to Pro Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Melo Pro Subscription</Text>

          <Text style={styles.description}>
            You can manage or cancel your Melo Pro subscription from this page.
            This includes canceling renewal, updating your billing method, and
            viewing invoices securely through our payment provider.
          </Text>

          <View style={styles.divider} />

          {/* 🔥 NOW WITH LOADING SPINNER + REDIRECT MESSAGE */}
          <TouchableOpacity
            style={[styles.cancelButton, loading && { opacity: 0.7 }]}
            onPress={openBillingPortal}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>
                  Redirecting to Stripe...
                </Text>
              </View>
            ) : (
              <Text style={styles.cancelButtonText}>
                Cancel / Manage Subscription
              </Text>
            )}
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/seller-hub")}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Canceling will stop future renewals. Your Melo Pro benefits remain
          active until the end of your current billing period as per Stripe’s
          subscription policy.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F1E17",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 18,
  },
  cancelButton: {
    backgroundColor: "#7FAF9B", // Melo header color (consistent)
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#F4F4F4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  note: {
    marginTop: 16,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    lineHeight: 18,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
})