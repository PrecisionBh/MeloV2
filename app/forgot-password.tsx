import KeyboardWrapper from "@/components/KeyboardWrapper"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { handleAppError } from "../lib/errors/appError"
import { supabase } from "../lib/supabase"

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    try {
      const normalizedEmail = email.trim().toLowerCase()

      if (!normalizedEmail) {
        Alert.alert("Missing Email", "Please enter your account email.")
        return
      }

      setLoading(true)

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) throw error

      router.push(`/verify-otp?email=${normalizedEmail}`)
    } catch (err) {
      handleAppError(err, {
        context: "forgot_password_otp_send",
        fallbackMessage:
          "Failed to send verification code. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardWrapper contentContainerStyle={styles.screen}>
      {/* BRANDING */}
      <View style={styles.branding}>
        <Text style={styles.brandTitle}>MELO</Text>
        <Text style={styles.subtitle}>
          Reset your password securely
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.description}>
          Enter your email and we’ll send you a verification code.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6B8F82"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!email.trim() || loading) && styles.buttonDisabled,
          ]}
          onPress={handleReset}
          disabled={!email.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Send Verification Code
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER (no absolute so it doesn’t break with keyboard) */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Partnered With Precision Sports LLC
        </Text>
      </View>
    </KeyboardWrapper>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 80, // 🔥 iOS safe spacing
  },

  branding: {
    alignItems: "center",
    marginBottom: 28,
  },

  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2E5F4F",
    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B8F82",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: "#2E5F4F",
  },

  description: {
    fontSize: 14,
    color: "#6B8F82",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D3DED8",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F1E17",
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#7FAF9B",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#D3DED8",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  backText: {
    textAlign: "center",
    color: "#6B8F82",
    marginTop: 16,
    fontWeight: "600",
  },

  footerContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  footerText: {
    color: "#9DB6AC",
    fontSize: 12,
    fontWeight: "600",
  },
})