import { Image, StyleSheet, Text, View } from "react-native"

type Props = {
  imageUrl: string | null
  orderId: string
  title?: string | null
  status?: string
  tracking_status?: string | null
  isDisputed?: boolean | null
  hasReturnTracking?: boolean
}

export default function SellerOrderHeaderCard({
  imageUrl,
  orderId,
  title,
  status,
  tracking_status,
  isDisputed,
  hasReturnTracking = false,
}: Props) {
  // 🔥 GLOBAL MELO ORDER NUMBER STANDARD
  const displayOrderNumber =
    orderId?.startsWith("Melo")
      ? orderId
      : orderId
      ? `Melo${orderId.replace(/-/g, "").slice(0, 6)}`
      : "Melo------"

  /* ---------------- BADGE TEXT ---------------- */

  const getBadgeText = () => {
    if (!status) return ""

    const ts = tracking_status

    // 🟢 FINAL ESCROW STATES (HIGHEST PRIORITY)
    if (status === "refunded") return "REFUND PAID"
    if (status === "completed") return "COMPLETED"
    if (status === "cancelled" || status === "cancelled_by_seller")
      return "CANCELLED"

    // 🔁 RETURN FLOW
    if (status === "return_processing") {
      if (isDisputed) return "RETURN DISPUTED – UNDER REVIEW"
      return "RETURN UNDER REVIEW"
    }

    if (status === "return_started") {
      if (hasReturnTracking) return "RETURN IN TRANSIT (BACK TO YOU)"
      return "RETURN STARTED"
    }

    // ⚠️ DISPUTE
    if (status === "disputed") return "ORDER DISPUTED"

    // 🚚 SHIPPING STATES (FROM TRACKING)
    if (ts === "delivered") return "DELIVERED"
    if (ts === "in_transit" || ts === "out_for_delivery")
      return "IN TRANSIT"
    if (ts === "label_created") return "LABEL CREATED"

    // 📦 BASE SHIPPING
    if (status === "shipped") return "SHIPPED"

    // 🟡 NEED ACTION
    if (status === "paid") return "PAID (ADD TRACKING)"

    // 🔤 FALLBACK
    return status.replace(/_/g, " ").toUpperCase()
  }

  /* ---------------- BADGE STYLE ---------------- */

  const getBadgeStyle = () => {
    if (status === "completed") return styles.completedBadge
    if (status === "refunded") return styles.refundedBadge
    if (status === "cancelled" || status === "cancelled_by_seller")
      return styles.cancelledBadge

    if (status === "return_processing") return styles.returnBadge
    if (status === "return_started") return styles.returnStartedBadge

    if (tracking_status === "delivered") return styles.deliveredBadge
    if (
      tracking_status === "in_transit" ||
      tracking_status === "out_for_delivery"
    )
      return styles.transitBadge

    if (tracking_status === "label_created") return styles.labelBadge

    if (status === "paid") return styles.actionRequiredBadge

    return styles.badge
  }

  const badgeText = getBadgeText()

  return (
    <>
      <Image
        source={{ uri: imageUrl ?? undefined }}
        style={styles.image}
      />

      <View style={styles.content}>
        {/* 🔥 TITLE + BADGE */}
        <View style={styles.topRow}>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title || "Untitled Listing"}
          </Text>

          {badgeText ? (
            <View style={[styles.badge, getBadgeStyle()]}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          ) : null}
        </View>

        {/* 🔽 ORDER NUMBER */}
        <Text style={styles.orderNumber}>
          Order #{displayOrderNumber}
        </Text>
      </View>
    </>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },

  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F1E17",
    marginRight: 8,
  },

  orderNumber: {
    fontSize: 13,
    color: "#6B8F7D",
    fontWeight: "700",
    marginTop: 4,
  },

  /* 🟩 DEFAULT */
  badge: {
    backgroundColor: "#7FAF9B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexShrink: 0,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.3,
  },

  /* 💰 COMPLETED */
  completedBadge: {
    backgroundColor: "#27AE60",
  },

  /* 🧾 REFUND */
  refundedBadge: {
    backgroundColor: "#1F7A63",
  },

  /* ❌ CANCELLED */
  cancelledBadge: {
    backgroundColor: "#B91C1C",
  },

  /* 🔁 RETURN */
  returnBadge: {
    backgroundColor: "#A855F7",
  },

  returnStartedBadge: {
    backgroundColor: "#9333EA",
  },

  /* 🚚 SHIPPING */
  deliveredBadge: {
    backgroundColor: "#1E7E34",
  },

  transitBadge: {
    backgroundColor: "#1A73E8",
  },

  labelBadge: {
    backgroundColor: "#6B7280",
  },

  /* ⚠️ ACTION NEEDED */
  actionRequiredBadge: {
    backgroundColor: "#F59E0B",
  },
})