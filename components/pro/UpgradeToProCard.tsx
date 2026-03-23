import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"

type Props = {
  variant?: "full" | "compact"
  style?: any
}

export default function UpgradeToProButton({ variant = "full", style }: Props) {
  const router = useRouter()
  const { session } = useAuth()
  const userId = session?.user?.id

  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const checkPro = async () => {
      try {
        if (!userId) {
          setIsPro(false)
          return
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", userId)
          .single()

        if (error) throw error

        setIsPro(!!data?.is_pro)
      } catch {
        setIsPro(false)
      } finally {
        setLoading(false)
      }
    }

    checkPro()
  }, [userId])

  if (loading) {
    return (
      <View style={[styles.loadingWrap, style]}>
        <ActivityIndicator />
      </View>
    )
  }

  if (isPro) return null

  const onPress = () => {
    if (!userId) {
      router.push("/login")
      return
    }

    router.push("/melo-pro")
  }

  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={[styles.compactBtn, style]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Ionicons name="diamond-outline" size={14} color="#FFD700" />
        <Text style={styles.compactText}>Melo Pro • $24.99/mo</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.proCard, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.glow} />

      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="diamond-outline" size={20} color="#FFD700" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Upgrade to Melo Pro</Text>

          {/* ✅ UPDATED TO MATCH BACKEND */}
          <Text style={styles.subtitle}>
            $24.99/mo • 5 Boosts + 1 Mega Boost • Lower 3.5% seller fees • Track payouts • Sell multiple quantities
          </Text>
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillText}>GO PRO</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  proCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#0B1511",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.28)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  glow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFD700",
    opacity: 0.08,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,215,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.72)",
    marginTop: 3,
    lineHeight: 17,
  },

  pill: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pillText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#0B1511",
    letterSpacing: 1,
  },

  compactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0B1511",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  compactText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFD700",
    letterSpacing: 0.5,
  },
})