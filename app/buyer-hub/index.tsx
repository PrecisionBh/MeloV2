import AppHeader from "@/components/app-header"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function BuyerHubScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader title="Buying" backLabel="Profile" backRoute="/profile" />

      {/* QUICK ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.sectionSubtitle}>
          Access your purchases and offers
        </Text>

        <View style={styles.card}>
          <HubItem
            icon="cube-outline"
            label="My Orders"
            onPress={() => router.push("/buyer-hub/orders")}
          />

          <HubItem
            icon="pricetag-outline"
            label="My Offers"
            onPress={() => router.push("/buyer-hub/offers")}
          />
        </View>
      </View>

      {/* MANAGEMENT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>
        <Text style={styles.sectionSubtitle}>
          Messages and account tools
        </Text>

        <View style={styles.card}>
          <HubItem
            icon="chatbubble-ellipses-outline"
            label="Messages"
            onPress={() => router.push("/messages")}
          />

          <HubItem
            icon="settings-outline"
            label="Settings"
            onPress={() => router.push("/settings")}
          />
        </View>
      </View>
    </View>
  )
}

/* ---------------- HUB ITEM ---------------- */

function HubItem({
  icon,
  label,
  onPress,
}: {
  icon: any
  label: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#0F1E17" />

      <Text style={styles.itemText}>{label}</Text>

      <View style={{ flex: 1 }} />

      <Ionicons name="chevron-forward" size={18} color="#9FB8AC" />
    </TouchableOpacity>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4EF",
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F1E17",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#6B8F7D",
    marginTop: 2,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6EFEA",
  },

  itemText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F1E17",
  },
})