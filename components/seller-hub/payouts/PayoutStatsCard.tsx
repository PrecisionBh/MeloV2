import { StyleSheet, Text, View } from "react-native"

type Props = {
  lifetimeEarningsCents: number
  totalWithdrawnCents: number
  totalFeesPaidCents?: number
  currency?: string
}

function formatMoney(cents: number, currency: string = "USD") {
  const safeCents = Number.isFinite(cents) ? cents : 0
  const dollars = safeCents / 100
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency,
  })
}

export default function PayoutStatsCard({
  lifetimeEarningsCents,
  totalWithdrawnCents,
  totalFeesPaidCents = 0,
  currency = "USD",
}: Props) {
  const lifetimeFormatted = formatMoney(lifetimeEarningsCents ?? 0, currency)
  const withdrawnFormatted = formatMoney(totalWithdrawnCents ?? 0, currency)
  const feesFormatted = formatMoney(totalFeesPaidCents ?? 0, currency)

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Financial Overview</Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.label}>Lifetime Earned</Text>
          <Text style={styles.valuePrimary}>{lifetimeFormatted}</Text>
          <Text style={styles.hint}>Gross earnings</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.label}>Total Withdrawn</Text>
          <Text style={styles.valueSecondary}>{withdrawnFormatted}</Text>
          <Text style={styles.hint}>Net deposited</Text>
        </View>

        <View style={styles.statBoxFull}>
          <Text style={styles.label}>Fees Paid</Text>
          <Text style={styles.valueFee}>{feesFormatted}</Text>
          <Text style={styles.hint}>
            Tip: payout processing fees are typically deductible business
            expenses — keep records for tax season.
          </Text>
        </View>
      </View>

      <Text style={styles.subtext}>
        Use this overview for bookkeeping and payout tracking. Keep payout fees
        documented for tax preparation.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2EFE8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F1E17",
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statBox: {
    width: "48%",
    backgroundColor: "#F7FBF9",
    borderWidth: 1,
    borderColor: "#E2EFE8",
    borderRadius: 14,
    padding: 12,
  },

  statBoxFull: {
    width: "100%",
    backgroundColor: "#F7FBF9",
    borderWidth: 1,
    borderColor: "#E2EFE8",
    borderRadius: 14,
    padding: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6B8F7D",
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  valuePrimary: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F7A63",
  },

  valueSecondary: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F1E17",
  },

  valueFee: {
    fontSize: 18,
    fontWeight: "900",
    color: "#E5484D",
  },

  hint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#6B8F7D",
    lineHeight: 16,
  },

  subtext: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#6B8F7D",
    lineHeight: 18,
  },
})