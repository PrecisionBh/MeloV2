import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

import AppHeader from "@/components/app-header"
import { supabase } from "@/lib/supabase"

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL

export default function DeleteAccountScreen() {
  const router = useRouter()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)

  /* ---------------- LOAD PROFILE ---------------- */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData?.user?.id

        if (!userId) return

        const { data } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", userId)
          .single()

        setIsPro(!!data?.is_pro)
      } catch (err) {
        console.error("Profile load error:", err)
      }
    }

    loadProfile()
  }, [])

  /* ---------------- DELETE FLOW ---------------- */

  const handleDelete = async () => {
    try {
      setLoading(true)

      const { data } = await supabase.auth.getUser()
      const userId = data?.user?.id

      if (!userId) throw new Error("No user found")

      await fetch(`${SUPABASE_URL}/functions/v1/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })

      await supabase.auth.signOut()

      // ✅ Reset stack so user can't go back
      router.replace("/login")
    } catch (err) {
      console.error("Delete account error:", err)
    } finally {
      setLoading(false)
      setVisible(false)
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Delete Account"
        backLabel="Back"
        onBack={() => router.back()}
      />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Delete Your Account</Text>

        <Text style={styles.description}>
          Deleting your account will permanently remove your profile, listings,
          messages, wallet data, and all associated activity.
        </Text>

        <Text style={styles.warning}>
          This action cannot be undone.
        </Text>

        {/* 🔥 PRO USER WARNING */}
        {isPro && (
          <Text style={styles.proWarning}>
            You currently have an active Melo Pro subscription. Deleting your
            account will NOT cancel your subscription. You must cancel it in your
            iPhone Settings under Subscriptions.
          </Text>
        )}

        {/* DELETE BUTTON */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* CONFIRM MODAL */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Final Confirmation</Text>

            <Text style={styles.modalText}>
              Are you absolutely sure you want to delete your account? This
              action cannot be reversed.
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDelete}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },

  warning: {
    color: "#FF3B30",
    fontWeight: "600",
    marginBottom: 16,
  },

  proWarning: {
    color: "#FF9500",
    fontSize: 13,
    marginBottom: 20,
  },

  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
  },

  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
  },

  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "600",
  },

  confirmDelete: {
    flex: 1,
    marginLeft: 10,
    padding: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
  },

  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
})