import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"
import { useAuth } from "@/context/AuthContext"
import { handleAppError } from "@/lib/errors/appError"
import { supabase } from "@/lib/supabase"

/* ---------------- TYPES ---------------- */

type Wallet = {
  available_balance_cents: number
}

/* ---------------- SCREEN ---------------- */

export default function WithdrawalScreen() {
  const router = useRouter()
  const { session } = useAuth()

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [rawAmount, setRawAmount] = useState("")
  const [withdrawing, setWithdrawing] = useState(false)

  const payoutType: "standard" = "standard"

  /* ---------------- LOAD WALLET ---------------- */

  const loadWallet = async () => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("available_balance_cents")
        .eq("user_id", session!.user.id)
        .single()

      if (error) {
        handleAppError(error, {
          context: "withdrawal_load_wallet",
          fallbackMessage: "Failed to load wallet. Please try again.",
        })
        router.back()
        return
      }

      setWallet(data)
    } catch (err) {
      handleAppError(err, {
        context: "withdrawal_load_wallet_catch",
        fallbackMessage: "Failed to load wallet. Please try again.",
      })
      router.back()
    }
  }

  useEffect(() => {
    if (session?.user?.id) loadWallet()
  }, [session?.user?.id])

  if (!wallet) return null

  /* ---------------- AMOUNT ---------------- */

  const available = wallet.available_balance_cents / 100
  const numericAmount =
    Number(rawAmount.replace(/[^0-9]/g, "")) / 100

  const formattedAmount = `$${numericAmount.toFixed(2)}`
  const isValidAmount =
    numericAmount > 0 && numericAmount <= available

  const netDeposit = numericAmount

  /* ---------------- SUBMIT ---------------- */

  const handleWithdraw = async () => {
    if (!isValidAmount || withdrawing) return

    try {
      setWithdrawing(true)

      const amount_cents = Math.round(numericAmount * 100)

      const { error } = await supabase.functions.invoke(
        "execute-withdrawal",
        {
          body: {
            user_id: session!.user.id,
            amount_cents,
            payout_type: payoutType,
          },
        }
      )

      if (error) {
        console.log("🚨 WITHDRAW ERROR RAW:", error)

        Alert.alert(
          "Funds Processing",
          "Your funds are safe.\n\nThey are currently being processed and are usually ready to withdraw within 1–2 days after delivery.\n\nIf it takes longer than expected, please contact us at support@melomarketplace.app."
        )

        setWithdrawing(false)
        return
      }

      setWithdrawing(false)

      Alert.alert(
        "Success",
        "Your payout is on the way and will arrive in 3–5 business days."
      )

      await loadWallet()
      router.back()
    } catch (err) {
      setWithdrawing(false)
      handleAppError(err, {
        context: "withdrawal_handle_withdraw_catch",
        fallbackMessage: "Withdrawal failed. Please try again.",
      })
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#EAF4EF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader title="Withdraw" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* BALANCE */}
        <View style={styles.balanceBlock}>
          <Text style={styles.cardLabel}>Available balance</Text>
          <Text style={styles.primaryValue}>
            ${available.toFixed(2)}
          </Text>
        </View>

        {/* AMOUNT */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Withdrawal amount</Text>
          <TextInput
            value={formattedAmount}
            onChangeText={setRawAmount}
            keyboardType="numeric"
            style={styles.amountInput}
          />
        </View>

        {/* RECEIPT */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Receipt</Text>

          <View style={styles.row}>
            <Text>Withdrawal amount</Text>
            <Text>${numericAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Melo processing fee</Text>
            <Text>$0.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.bold}>Estimated deposit</Text>
            <Text style={styles.bold}>
              ${netDeposit.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.helperText}>
            Standard payouts typically arrive within 3–5 business days depending on your bank.
          </Text>
        </View>

        {/* PAYOUT METHOD */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Payout method</Text>

          <Text style={{ fontWeight: "900", fontSize: 16 }}>
            Standard Payout
          </Text>

          <Text style={styles.helperText}>
            Deposits typically arrive within 3–5 business days.
          </Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!isValidAmount || withdrawing) && { opacity: 0.4 },
          ]}
          disabled={!isValidAmount || withdrawing}
          onPress={handleWithdraw}
        >
          <Text style={styles.submitText}>
            {withdrawing ? "Processing…" : "Withdraw funds"}
          </Text>
        </TouchableOpacity>

        {/* DISCLAIMER */}
        <Text style={[styles.helperText, { textAlign: "center", marginTop: 8 }]}>
          Payouts typically take 3–5 business days to arrive.
        </Text>

        {/* INSTANT COMING SOON */}
        <View style={styles.instantCard}>
          <Text style={styles.instantTitle}>⚡ Instant Payouts</Text>
          <Text style={styles.helperText}>
            Coming soon. Instant payouts will unlock automatically after account activity.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },

  balanceBlock: { alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B8F7D",
    marginBottom: 6,
  },

  primaryValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F1E17",
  },

  amountInput: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F1E17",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },

  bold: { fontWeight: "900" },

  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B8F7D",
  },

  submitBtn: {
    backgroundColor: "#1F7A63",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },

  submitText: {
    textAlign: "center",
    fontWeight: "900",
    color: "#fff",
    fontSize: 16,
  },

  instantCard: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginTop: 12,
  marginBottom: 66, // ✅ adds breathing room from bottom
  borderWidth: 1,
  borderColor: "#E6EFEA",

  // ✅ reinforce bottom edge
  borderBottomWidth: 2,
  borderBottomColor: "#DDE7E2",
},

  instantTitle: {
    fontWeight: "900",
    fontSize: 14,
  },
})