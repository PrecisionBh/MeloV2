import { useLocalSearchParams, useRouter } from "expo-router"
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
import { supabase } from "../lib/supabase"

export default function VerifyOtpScreen() {
  const router = useRouter()
  const { email } = useLocalSearchParams()

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    try {
      if (!code.trim()) {
        Alert.alert("Missing Code", "Please enter the verification code.")
        return
      }

      setLoading(true)

      const { error } = await supabase.auth.verifyOtp({
        email: String(email),
        token: code.trim(),
        type: "email",
      })

      if (error) throw error

      router.replace("/reset-password")
    } catch (err: any) {
      Alert.alert("Invalid Code", err.message || "Verification failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      {/* BRANDING */}
      <View style={styles.branding}>
        <Text style={styles.brandTitle}>MELO</Text>
        <Text style={styles.subtitle}>
          Enter the verification code
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Verify Email</Text>

        <Text style={styles.description}>
          Enter the 6-digit code sent to your email.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="6 Digit Code"
          placeholderTextColor="#6B8F82"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!code.trim() || loading) && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!code.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Verify Code
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Partnered With Precision Sports LLC
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  branding: {
    alignItems: "center",
    marginBottom: 28,
    transform: [{ translateY: -40 }],
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
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 6,
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
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  footerText: {
    color: "#9DB6AC",
    fontSize: 12,
    fontWeight: "600",
  },
})