import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

type Props = {
  isPro: boolean
}

export default function ProBenefitsCard({ isPro }: Props) {
  return (
    <View style={[styles.container, !isPro && styles.locked]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={18} color="#CFAF4A" />
        <Text style={styles.title}>What Melo Pro Unlocks</Text>

        {!isPro && (
          <View style={styles.proPill}>
            <Text style={styles.proPillText}>PRO</Text>
          </View>
        )}
      </View>

      {/* Benefits List */}
      <View style={styles.list}>
        <Benefit text="Lower seller fees (5% → 3.5%)" />
        <Benefit text="5 free Boosts on sign-up" />
        <Benefit text="1 free Mega Boost on sign-up" />
        <Benefit text="Automatic payout history & bookkeeping" />
        <Benefit text="Premium public profile + Pro badge" />
        <Benefit text="Purchase additional boosts & mega boosts" />
        <Benefit text="Add quantities to your listings to sell more at once" />
      </View>
    </View>
  )
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Ionicons name="checkmark-circle" size={16} color="#7FAF9B" />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: "#F1F8F5", // same soft Melo tone as create listing
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6E6DE",
  },
  locked: {
    opacity: 0.75, // subtle “you’re missing this” look (NOT gray washed)
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#2E5F4F",
  },
  proPill: {
    marginLeft: "auto",
    backgroundColor: "#CFAF4A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  proPillText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#0F1E17",
  },
  list: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E5F4F",
  },
})