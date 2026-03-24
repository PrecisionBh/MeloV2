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
} from "react-native"
import { handleAppError } from "../lib/errors/appError"
import { supabase } from "../lib/supabase"

export default function ResetPasswordScreen() {
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const passwordTooShort = password.length > 0 && password.length < 6
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const isValid =
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword

  const handleResetPassword = async () => {
    if (!isValid || loading) return

    try {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        Alert.alert(
          "Session Expired",
          "Your verification session expired. Please request a new reset code."
        )
        router.replace("/forgot-password")
        return
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      Alert.alert(
        "Password Updated",
        "Your password has been successfully changed. Please sign in.",
        [
          {
            text: "OK",
            onPress: async () => {
              await supabase.auth.signOut()
              router.replace("/signinscreen")
            },
          },
        ]
      )
    } catch (err) {
      handleAppError(err, {
        context: "password_reset",
        fallbackMessage:
          "Failed to update password. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardWrapper contentContainerStyle={styles.screen}>
      {/* BRANDING */}
      <Text style={styles.brandTitle}>MELO</Text>
      <Text style={styles.subtitle}>Secure Password Reset</Text>

      {/* CARD */}
      <Text style={styles.title}>Create New Password</Text>

      <View style={styles.card}>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
            placeholderTextColor="#6B8F82"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
            <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#6B8F82"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
        </View>

        {passwordTooShort && (
          <Text style={styles.error}>
            Password must be at least 6 characters
          </Text>
        )}

        {passwordsDoNotMatch && (
          <Text style={styles.error}>Passwords do not match</Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!isValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleResetPassword}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardWrapper>
  )
}

import { View } from "react-native"

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 80, // 🔥 KEY FIX FOR iOS
  },

  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2E5F4F",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B8F82",
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: "#2E5F4F",
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

  passwordWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D3DED8",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F1E17",
  },

  eye: {
    paddingHorizontal: 14,
    fontSize: 16,
  },

  error: {
    color: "#D64545",
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "600",
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
})