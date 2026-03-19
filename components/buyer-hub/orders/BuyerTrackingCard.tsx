import { StyleSheet, Text, View } from "react-native"

type Props = {
  status?: string | null
  deliveredAt?: string | null
  isReturn?: boolean // 🔥 NEW
}

export default function BuyerTrackingCard({
  status,
  deliveredAt,
  isReturn = false,
}: Props) {
  const getMessage = () => {
    /* ================= NORMAL SHIPPING ================= */

    if (!isReturn) {
      switch (status) {
        case "shipped":
          return {
            title: "Shipment Started",
            message:
              "The seller has shipped your order and it is on the way.",
          }

        case "in_transit":
          return {
            title: "In Transit",
            message:
              "Your order is currently on the way to you.",
          }

        case "delivered":
          return {
            title: "Delivered",
            message:
              "Your order has been delivered. You have 2 days to report any issues before the order is completed automatically.",
          }

        default:
          return null
      }
    }

    /* ================= RETURN FLOW ================= */

    if (isReturn) {
      switch (status) {
        case "in_transit":
          return {
            title: "Return In Transit",
            message:
              "Your return is on the way back to the seller.",
          }

        case "delivered":
          return {
            title: "Return Delivered",
            message:
              "Your return has been delivered. The seller has 2 days to complete the return before your refund is automatically processed.",
          }

        default:
          return null
      }
    }

    return null
  }

  const data = getMessage()

  if (!data) return null

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.message}>{data.message}</Text>

      {status === "delivered" && deliveredAt && (
        <Text style={styles.date}>
          {isReturn ? "Return delivered on " : "Delivered on "}
          {new Date(deliveredAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F1E17",
    marginBottom: 4,
  },

  message: {
    fontSize: 13,
    color: "#4B6A5D",
    fontWeight: "600",
    lineHeight: 18,
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B8F7D",
    fontWeight: "600",
  },
})