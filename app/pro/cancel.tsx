import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import AppHeader from "@/components/app-header"

export default function ProCancelScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Header (keeps consistency with your Pro flow) */}
      <AppHeader title="Melo Pro" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>No Pressure — You're in Control</Text>

          <Text style={styles.message}>
            We want you to feel completely comfortable with every purchase you
            make on Melo. Melo Pro is designed to give your listings stronger
            visibility, more exposure, and better selling opportunities across
            the marketplace.
          </Text>

          <Text style={styles.message}>
            Whenever you're ready to grow your reach and stand out to more
            buyers, Melo Pro will be here waiting for you.
          </Text>

          <Text style={styles.subMessage}>
            In the meantime, you can continue using the marketplace as usual —
            and upgrade anytime when it makes sense for you.
          </Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.replace("/home")}
            activeOpacity={0.85}
          >
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 13,
    color: "#777",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  homeButton: {
    backgroundColor: "#7FAF9B", // Melo brand color
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
})