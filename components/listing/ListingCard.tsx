import { Ionicons } from "@expo/vector-icons"
import { useMemo } from "react"
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export type Listing = {
  id: string
  title: string
  price: number
  image_urls: string[] | null
  status: "active" | "inactive"
  is_boosted?: boolean
  boost_expires_at?: string | null
  is_mega_boost?: boolean
  mega_boost_expires_at?: string | null
}

type Props = {
  item: Listing
  isPro: boolean
  boostRemaining: number
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
  onDeactivate: () => void
  onDuplicate: () => void
  onBoost: () => void
  onMegaBoost: () => void
}

export default function ListingCard({
  item,
  isPro,
  boostRemaining,
  onPress,
  onEdit,
  onDelete,
  onDeactivate,
  onDuplicate,
  onBoost,
  onMegaBoost,
}: Props) {

  const thumbnail = item.image_urls?.[0] ?? null
  const isActive = item.status === "active"

  // only disable if listing inactive
  const boostDisabled = !isActive
  const megaDisabled = !isActive

  const boostBadge = useMemo(() => {

    const now = Date.now()

    // 🚀 MEGA BOOST BADGE
    if (item.is_mega_boost && item.mega_boost_expires_at) {
      try {
        const expires = new Date(item.mega_boost_expires_at).getTime()
        const diff = expires - now

        if (diff <= 0) return "MEGA BOOST EXPIRED"

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
        return `MEGA BOOST · ${days}d`
      } catch {
        return "🚀 MEGA BOOST"
      }
    }

    // ⚡ NORMAL BOOST BADGE
    if (!item.is_boosted || !item.boost_expires_at) return null

    try {
      const expires = new Date(item.boost_expires_at).getTime()
      const diff = expires - now

      if (diff <= 0) return "BOOST EXPIRED"

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      return `BOOSTED · ${days}d`
    } catch {
      return "BOOSTED"
    }

  }, [
    item.is_boosted,
    item.boost_expires_at,
    item.is_mega_boost,
    item.mega_boost_expires_at,
  ])

  const confirmDelete = () => {
    Alert.alert(
      "Delete Listing",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    )
  }

  const confirmDeactivate = () => {
    Alert.alert(
      isActive ? "Pause Listing?" : "Relist Listing?",
      isActive
        ? "This listing will no longer be visible."
        : "This listing will become active again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isActive ? "Pause" : "Relist",
          onPress: isActive ? onDeactivate : onDuplicate,
        },
      ]
    )
  }

  const confirmBoost = () => {

    const now = Date.now()

    const boostActive =
      item.boost_expires_at &&
      new Date(item.boost_expires_at).getTime() > now

    const megaActive =
      item.mega_boost_expires_at &&
      new Date(item.mega_boost_expires_at).getTime() > now

    if (boostActive || megaActive) {
      Alert.alert(
        "Already Boosted",
        "This listing already has an active boost. You can boost again once it expires.",
        [{ text: "OK" }]
      )
      return
    }

    if (!isPro) {
      Alert.alert(
        "Pro Required",
        "Boosting is available for Melo Pro members only.",
        [{ text: "OK" }]
      )
      return
    }

    if (boostRemaining <= 0) {
      Alert.alert(
        "No Boosts Remaining",
        "You’ve used all available boosts for this cycle.",
        [{ text: "OK" }]
      )
      return
    }

    Alert.alert(
      "Boost Listing",
      "Boost this listing for maximum visibility?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Boost", onPress: onBoost },
      ]
    )
  }

  const confirmMegaBoost = () => {

    const now = Date.now()

    const boostActive =
      item.boost_expires_at &&
      new Date(item.boost_expires_at).getTime() > now

    const megaActive =
      item.mega_boost_expires_at &&
      new Date(item.mega_boost_expires_at).getTime() > now

    if (boostActive || megaActive) {
      Alert.alert(
        "Already Boosted",
        "This listing already has an active boost.",
        [{ text: "OK" }]
      )
      return
    }

    if (!isPro) {
      Alert.alert(
        "Pro Required",
        "Mega Boost is available for Melo Pro members only.",
        [{ text: "OK" }]
      )
      return
    }

    Alert.alert(
      "Mega Boost Listing",
      "Mega Boost will dominate the marketplace for maximum exposure.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mega Boost", onPress: onMegaBoost },
      ]
    )
  }

  return (
    <TouchableOpacity
      style={[styles.card, !isActive && styles.cardInactive]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.topRow}>
        <View style={styles.thumbWrap}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Ionicons name="image-outline" size={20} color="#7A8F84" />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title || "Untitled listing"}
          </Text>

          <Text style={styles.price}>
            ${Number(item.price ?? 0).toFixed(2)}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.statusPill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isActive
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </Text>
            </View>

            {!!boostBadge && (
              <View style={styles.boostBadge}>
                <Ionicons name="flash" size={14} color="#CFAF4A" />
                <Text style={styles.boostBadgeText}>{boostBadge}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <BottomBtn icon="create-outline" label="Edit" onPress={onEdit} />

        <BottomBtn
          icon={isActive ? "pause-outline" : "refresh-outline"}
          label={isActive ? "Pause" : "Relist"}
          onPress={confirmDeactivate}
        />

        <BottomBtn
          icon="flash-outline"
          label="Boost"
          onPress={confirmBoost}
          variant="gold"
          disabled={boostDisabled}
        />

        <BottomBtn
          icon="rocket-outline"
          label="Mega"
          onPress={confirmMegaBoost}
          variant="gold"
          disabled={megaDisabled}
        />

        <BottomBtn
          icon="trash-outline"
          label="Delete"
          onPress={confirmDelete}
          variant="danger"
        />
      </View>
    </TouchableOpacity>
  )
}

function BottomBtn({
  icon,
  label,
  onPress,
  disabled = false,
  variant = "neutral",
}: {
  icon: any
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: "neutral" | "gold" | "danger"
}) {
  return (
    <TouchableOpacity
      style={[
        styles.bottomBtn,
        variant === "gold" && styles.bottomBtnGold,
        variant === "danger" && styles.bottomBtnDanger,
        disabled && styles.bottomBtnDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Ionicons
        name={icon}
        size={18}
        color={
          variant === "gold"
            ? "#CFAF4A"
            : variant === "danger"
            ? "#D9544D"
            : "#0F1E17"
        }
      />
      <Text
        style={[
          styles.bottomText,
          variant === "gold" && styles.bottomTextGold,
          variant === "danger" && styles.bottomTextDanger,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6EFEA",
    padding: 14,
    marginBottom: 14,
  },

  cardInactive: {
    opacity: 0.9,
  },

  topRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  thumbWrap: {
    width: 90,
    marginRight: 12,
  },

  thumb: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#F2F6F4",
  },

  thumbPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#F2F6F4",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F1E17",
  },

  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "900",
    color: "#0F1E17",
  },

  badgeRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },

  pillActive: {
    backgroundColor: "#F2FBF6",
    borderColor: "rgba(127,175,155,0.45)",
  },

  pillInactive: {
    backgroundColor: "#F5F6F6",
    borderColor: "rgba(15,30,23,0.12)",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  statusTextActive: {
    color: "#2C6E55",
  },

  statusTextInactive: {
    color: "rgba(15,30,23,0.55)",
  },

  boostBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#0B0F0D",
    borderWidth: 1,
    borderColor: "rgba(207,175,74,0.55)",
  },

  boostBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#CFAF4A",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bottomBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F2F6F4",
    borderWidth: 1,
    borderColor: "rgba(15,30,23,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  bottomBtnGold: {
    backgroundColor: "#0B0F0D",
    borderColor: "rgba(207,175,74,0.55)",
  },

  bottomBtnDanger: {
    backgroundColor: "#FFF3F2",
    borderColor: "rgba(217,84,77,0.30)",
  },

  bottomBtnDisabled: {
    opacity: 0.35,
  },

  bottomText: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
    color: "#0F1E17",
  },

  bottomTextGold: {
    color: "#CFAF4A",
  },

  bottomTextDanger: {
    color: "#D9544D",
  },
})