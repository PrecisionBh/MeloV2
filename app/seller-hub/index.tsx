import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"

import FreeDashboardSection from "@/components/seller-hub/FreeDashboardSection"
import ProBenefitsCard from "@/components/seller-hub/ProBenefitsCard"
import ProDashboardSection from "@/components/seller-hub/ProDashboardSection"
import ProTools from "@/components/seller-hub/protools"; // ✅ NEW
import { useAuth } from "@/context/AuthContext"
import { handleAppError } from "@/lib/errors/appError"
import { supabase } from "@/lib/supabase"

export default function SellerHubScreen() {
  const router = useRouter()
  const { session } = useAuth()
  const sellerId = session?.user?.id

  const [ordersToShipCount, setOrdersToShipCount] = useState(0)
  const [ordersInProgressCount, setOrdersInProgressCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [offersActionCount, setOffersActionCount] = useState(0)

  const [isPro, setIsPro] = useState(false)
  const [boostsRemaining, setBoostsRemaining] = useState<number>(0)
  const [megaBoostsRemaining, setMegaBoostsRemaining] = useState<number>(0)

  useFocusEffect(
    useCallback(() => {
      if (!sellerId) return

      loadProStatus()
      loadOrdersToShipCount()
      loadOrdersInProgressCount()
      loadUnreadMessagesCount()
      loadOffersActionCount()
    }, [sellerId])
  )

  const loadProStatus = async () => {
    if (!sellerId) return

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_pro, boosts_remaining, mega_boosts_remaining")
        .eq("id", sellerId)
        .single()

      if (error) throw error

      setIsPro(!!data?.is_pro)
      setBoostsRemaining(Number(data?.boosts_remaining ?? 0))
      setMegaBoostsRemaining(Number(data?.mega_boosts_remaining ?? 0))
    } catch (err) {
      setIsPro(false)
      setBoostsRemaining(0)
      setMegaBoostsRemaining(0)
      handleAppError(err, { silent: true })
    }
  }

  const loadOrdersToShipCount = async () => {
    if (!sellerId) return

    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("seller_id", sellerId)

    setOrdersToShipCount(count ?? 0)
  }

  const loadOrdersInProgressCount = async () => {
    if (!sellerId) return

    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .or(`
        tracking_status.eq.label_created,
        tracking_status.eq.in_transit,
        status.eq.return_started,
        status.eq.return_processing
      `)

    setOrdersInProgressCount(count ?? 0)
  }

  const loadUnreadMessagesCount = async () => {
    if (!sellerId) return

    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .eq("receiver_id", sellerId)

    setUnreadMessagesCount(count ?? 0)
  }

  const loadOffersActionCount = async () => {
    if (!sellerId) return

    const { count } = await supabase
      .from("offers")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .in("status", ["pending", "countered"])
      .neq("last_actor", "seller")

    setOffersActionCount(count ?? 0)
  }

  const totalOrdersBadge = ordersToShipCount + ordersInProgressCount

  return (
    <View style={styles.screen}>
      <AppHeader title="Seller Hub" backLabel="Profile" backRoute="/profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 🔥 DASHBOARD */}
        <FreeDashboardSection
          totalOrdersBadge={totalOrdersBadge}
          offersActionCount={offersActionCount}
          unreadMessagesCount={unreadMessagesCount}
        />

        {/* 🔥 BOOST (RIGHT UNDER SETTINGS) */}
        <ProDashboardSection
          userId={sellerId || ""}
          boostsRemaining={boostsRemaining}
          megaBoostsRemaining={megaBoostsRemaining}
          lastBoostReset={null}
          isPro={isPro}
        />

        {/* 🔥 PRO MEMBERS TITLE */}
        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Pro Members</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 🔥 BENEFITS */}
        <ProBenefitsCard isPro={isPro} />

        {/* 🔥 PRO TOOLS (NEW LOCATION) */}
        <ProTools isPro={isPro} />  

      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/seller-hub/create-listing")}
      >
        <Ionicons name="add" size={20} color="#0F1E17" />
        <Text style={styles.fabText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4EF",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDE9E3",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "900",
    color: "#5F7D71",
  },
  upgradeButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    bottom: 55,
    left: 24,
    right: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#7FAF9B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  fabText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F1E17",
  },
})