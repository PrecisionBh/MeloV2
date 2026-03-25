import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"

export default function ManageSubscriptionScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const openSubscriptionManager = async () => {
    try {
      setLoading(true)

      let url = ""

      if (Platform.OS === "ios") {
        url = "https://apps.apple.com/account/subscriptions"
      } else {
        url = "https://play.google.com/store/account/subscriptions"
      }

      const supported = await Linking.canOpenURL(url)

      if (!supported) {
        throw new Error("Cannot open subscription manager")
      }

      await Linking.openURL(url)
    } catch (err) {
      console.error("❌ Open subscription manager failed:", err)

      Alert.alert(
        "Error",
        "Unable to open subscription settings. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Manage Subscription" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Melo Pro Subscription</Text>

          <Text style={styles.description}>
            You can manage or cancel your Melo Pro subscription through your
            device’s app store. This includes canceling renewal and managing
            your billing securely through Apple or Google.
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.cancelButton, loading && { opacity: 0.7 }]}
            onPress={openSubscriptionManager}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>
                  Opening Subscription Settings...
                </Text>
              </View>
            ) : (
              <Text style={styles.cancelButtonText}>
                Manage Subscription
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/seller-hub")}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Seller Hub
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Canceling will stop future renewals. Your Melo Pro benefits remain
          active until the end of your current billing period.
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
    backgroundColor: "#7FAF9B",
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