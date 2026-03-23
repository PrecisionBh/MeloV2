import { supabase } from "@/lib/supabase"
import React, { useState } from "react"
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL

export default function DeleteAccountButton() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const openModal = () => setVisible(true)
  const closeModal = () => setVisible(false)

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
    } catch (err) {
      console.error("Delete account error:", err)
    } finally {
      setLoading(false)
      closeModal()
    }
  }

  return (
    <>
      {/* 🔴 BUTTON */}
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      {/* ⚠️ MODAL */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Delete Account</Text>

            <Text style={styles.description}>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </Text>

            <Text style={styles.warning}>
              Are you absolutely sure you want to continue?
            </Text>

            {/* ACTIONS */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.deleteText}>Delete Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },

  warning: {
    fontSize: 13,
    color: "#FF3B30",
    marginBottom: 20,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    marginLeft: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
  },

  deleteText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
})