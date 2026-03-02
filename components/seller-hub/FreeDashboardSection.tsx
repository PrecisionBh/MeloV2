import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useAuth } from "@/context/AuthContext"

type Props = {
  totalOrdersBadge: number
  offersActionCount: number
  unreadMessagesCount: number
}

type IconName = keyof typeof Ionicons.glyphMap

export default function FreeDashboardSection({
  totalOrdersBadge,
  offersActionCount,
  unreadMessagesCount,
}: Props) {
  const router = useRouter()
  const { session } = useAuth()
  const userId = session?.user?.id

  return (
    <View style={styles.container}>
      {/* ---------- QUICK ACTIONS ---------- */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.card}>
        <MenuItem
          icon="cube-outline"
          label="Orders"
          subtitle="Manage shipments & active orders"
          badgeCount={totalOrdersBadge}
          onPress={() => router.push("/seller-hub/orders")}
        />

        <Divider />

        <MenuItem
          icon="pricetags-outline"
          label="Offers"
          subtitle="Respond to buyer offers"
          badgeCount={offersActionCount}
          onPress={() => router.push("/seller-hub/offers")}
        />

        <Divider />

        <MenuItem
          icon="chatbubble-ellipses-outline"
          label="Messages"
          subtitle="View conversations with buyers"
          badgeCount={unreadMessagesCount}
          onPress={() => router.push("/messages")}
        />
      </View>

      {/* ---------- MANAGEMENT ---------- */}
      <Text style={styles.sectionTitle}>Management</Text>

      <View style={styles.card}>
        <MenuItem
          icon="grid-outline"
          label="My Listings"
          subtitle="View, edit, and manage your listings"
          onPress={() => router.push("/seller-hub/my-listings")}
        />

        <Divider />

        <MenuItem
          icon="wallet-outline"
          label="Wallet"
          subtitle="Track earnings & payouts"
          onPress={() => router.push("/seller-hub/wallet")}
        />

        <Divider />

        <MenuItem
          icon="person-outline"
          label="View Public Profile"
          subtitle="See your profile as buyers see it"
          onPress={() => {
            if (!userId) return
            router.push({
              pathname: "/public-profile/[userId]",
              params: { userId },
            })
          }}
        />
      </View>

      {/* ---------- SETTINGS ---------- */}
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.card}>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          subtitle="Account & seller preferences"
          onPress={() => router.push("/settings")}
        />
      </View>
    </View>
  )
}

/* ---------------- MENU ITEM ---------------- */

function MenuItem({
  icon,
  label,
  subtitle,
  badgeCount,
  onPress,
}: {
  icon: IconName
  label: string
  subtitle?: string
  badgeCount?: number
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color="#0F1E17" />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.menuText}>{label}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={{ flex: 1 }} />

      {typeof badgeCount === "number" && badgeCount > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{badgeCount}</Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={18} color="#9FB8AC" />
    </TouchableOpacity>
  )
}

/* ---------------- DIVIDER ---------------- */

function Divider() {
  return <View style={styles.divider} />
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 30, // room for FAB
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5F7D71",
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EAF4EF",
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
    marginLeft: 12,
  },

  menuText: {
    fontSize: 15,
    color: "#0F1E17",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    color: "#7A9A8D",
    marginTop: 2,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E6EFEA",
    marginLeft: 66, // aligns under text, past icon bubble
  },

  countBadge: {
    backgroundColor: "#EB5757",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 6,
  },

  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },
})