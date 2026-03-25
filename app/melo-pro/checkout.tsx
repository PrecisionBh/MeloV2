import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { getOfferings } from "@/lib/revenuecat"
import Purchases from "react-native-purchases"

import AppHeader from "@/components/app-header"
import { useAuth } from "@/context/AuthContext"
import { handleAppError } from "@/lib/errors/appError"
import { supabase } from "@/lib/supabase"

export default function MeloProCheckoutScreen() {
  const router = useRouter()
  const { session } = useAuth()

  const [loading, setLoading] = useState(false)
  const [rcPackage, setRcPackage] = useState<any>(null)
  const [price, setPrice] = useState("$24.99")

  useEffect(() => {
    const load = async () => {
      try {
        const offering = await getOfferings()
        if (!offering) return

        const proPackage = offering.availablePackages.find(
          (pkg) => pkg.product.identifier === "melo_pro_subscription"
        )

        if (!proPackage) return

        setRcPackage(proPackage)
        setPrice(proPackage.product.priceString)
      } catch (err) {
        console.error("❌ RevenueCat load error:", err)
      }
    }

    load()
  }, [])

  const handleSubscribe = async () => {
    if (!session?.user?.id) {
      Alert.alert("Sign in required", "Please log in to upgrade to Melo Pro.")
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      if (!rcPackage) throw new Error("Subscription not loaded")

      const { customerInfo } = await Purchases.purchasePackage(rcPackage)

      const isPro =
        customerInfo.entitlements.active["melo_marketplace_pro"]

      if (isPro) {
        await supabase.functions.invoke("grant-purchase", {
          body: {
            productId: "melo_pro_subscription",
            customerInfo,
          },
        })

        Alert.alert("Success", "You're now Melo Pro 🎉")
        router.replace("/profile")
      } else {
        throw new Error("Entitlement not active")
      }
    } catch (err: any) {
      if (!err?.userCancelled) {
        handleAppError(err, {
          fallbackMessage: "Unable to complete purchase.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases()

      await supabase.functions.invoke("grant-purchase", {
        body: {
          productId: "melo_pro_subscription",
          customerInfo,
        },
      })

      Alert.alert("Restored", "Your purchases have been restored")
    } catch (e) {
      Alert.alert("Error", "Failed to restore purchases")
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Melo Pro" backLabel="Back" backRoute="/melo-pro" />

      <View style={styles.card}>
        <Ionicons name="sparkles" size={24} color="#0F1E17" />

        <Text style={styles.title}>Upgrade to Melo Pro</Text>

        <Text style={styles.sub}>
          Unlock unlimited listings, monthly boosts, quantity selling, and
          premium seller tools designed to help you get more visibility and
          close more sales.
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Melo Pro</Text>
          <Text style={styles.price}>{price} / month</Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleSubscribe}
          activeOpacity={0.9}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F1E17" />
          ) : (
            <>
              <Ionicons name="rocket-outline" size={18} color="#0F1E17" />
              <Text style={styles.btnText}>
                Start Melo Pro Subscription
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          {price}/month. Auto-renews unless canceled at least 24 hours before
          the end of the billing period. Manage or cancel anytime in your
          account settings.
        </Text>

        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text style={styles.manageLink}>Manage Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.restoreLink}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* 🔥 REQUIRED LEGAL LINKS */}
        <TouchableOpacity onPress={() => router.push("/legal/terms")}>
          <Text style={styles.restoreLink}>Terms of Use</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/legal/privacy")}>
          <Text style={styles.restoreLink}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/melo-pro")}
          disabled={loading}
        >
          <Text style={styles.secondaryText}>Back to Melo Pro</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4EF",
  },
  card: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E6EFEA",
    alignItems: "center",
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F1E17",
  },
  sub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3E35",
    opacity: 0.9,
    lineHeight: 18,
    textAlign: "center",
  },
  priceBox: {
    marginTop: 16,
    backgroundColor: "#EAF4EF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#DCEAE3",
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F1E17",
    opacity: 0.7,
  },
  price: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: "#0F1E17",
  },
  btn: {
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#7FAF9B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F1E17",
  },
  disclaimer: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F1E17",
    opacity: 0.65,
    textAlign: "center",
    lineHeight: 16,
  },
  manageLink: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    color: "#7FAF9B",
  },
  restoreLink: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "900",
    color: "#0F1E17",
    opacity: 0.7,
  },
  secondaryBtn: {
    marginTop: 10,
    paddingVertical: 10,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F1E17",
    opacity: 0.7,
  },
})