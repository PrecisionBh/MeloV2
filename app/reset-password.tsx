import * as Linking from "expo-linking"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
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

export default function ResetPasswordScreen() {
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  const processedUrlRef = useRef<string | null>(null)

  const passwordTooShort = password.length > 0 && password.length < 6
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const isValid =
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword

  /* ---------------- HANDLE RESET LINK ---------------- */

  useEffect(() => {
    let subscription: any

    const processUrl = async (url: string | null) => {
      try {
        if (!url) {
          setSessionReady(true)
          return
        }

        // Prevent processing same link twice
        if (processedUrlRef.current === url) return
        processedUrlRef.current = url

        const hashIndex = url.indexOf("#")

        if (hashIndex === -1) {
          setSessionReady(true)
          return
        }

        const fragment = url.substring(hashIndex + 1)

        const params: Record<string, string> = {}

        fragment.split("&").forEach((pair) => {
          const [key, value] = pair.split("=")
          if (key && value) {
            params[key] = decodeURIComponent(value)
          }
        })

        const access_token = params["access_token"]
        const refresh_token = params["refresh_token"]
        const type = params["type"]

        if (!access_token || !refresh_token || type !== "recovery") {
          setSessionReady(true)
          return
        }

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error) throw error
      } catch (err) {
        handleAppError(err, {
          context: "password_reset_session",
          fallbackMessage:
            "This reset link may have expired. Please request a new one.",
        })
      } finally {
        setSessionReady(true)
      }
    }

    const init = async () => {
      const initialUrl = await Linking.getInitialURL()
      await processUrl(initialUrl)
    }

    init()

    subscription = Linking.addEventListener("url", ({ url }) => {
      processUrl(url)
    })

    return () => {
      subscription?.remove?.()
    }
  }, [])

  /* ---------------- RESET PASSWORD ---------------- */

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
          "Your reset session expired. Please request a new password reset link."
        )
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
          "Failed to update password. Please try the reset link again.",
      })
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- LOADING ---------------- */

  if (!sessionReady) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#7FAF9B" />
      </View>
    )
  }

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.screen}>
      <View style={styles.branding}>
        <Text style={styles.brandTitle}>MELO</Text>
        <Text style={styles.subtitle}>Secure Password Reset</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create New Password</Text>

        {/* PASSWORD FIELD */}

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

          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
          >
            <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD */}

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
    marginBottom: 20,
    textAlign: "center",
    color: "#2E5F4F",
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