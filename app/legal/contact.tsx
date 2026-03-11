import { useRouter } from "expo-router"
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native"

import AppHeader from "@/components/app-header"

export default function ContactScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <AppHeader
        title="Contact Support"
        backLabel="Legal"
        backRoute="/legal"
      />

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Contact Melo Support">
          <Text style={styles.text}>
            If you need assistance with an order, payment, dispute,
            listing, or account issue, the Melo support team is here to help.
          </Text>

          <Text style={styles.text}>
            The fastest way to reach support is by email.
          </Text>
        </Section>

        <Section title="Support Email">
          <Text style={styles.email}>
            support@melomarketplace.app
          </Text>
        </Section>

        <Section title="What to Include in Your Message">
          <Text style={styles.text}>
            To help us resolve your issue as quickly as possible,
            please include the following details in your email:
          </Text>

          <Text style={styles.list}>
            • Your Melo account email{"\n"}
            • Order ID (if your issue is related to an order){"\n"}
            • A short description of the issue{"\n"}
            • Any relevant screenshots or photos
          </Text>
        </Section>

        <Section title="Support Response Time">
          <Text style={styles.text}>
            Most support requests are reviewed and responded to within
            24–48 hours.
          </Text>

          <Text style={styles.text}>
            During periods of high activity, response times may vary.
          </Text>
        </Section>

        <Section title="Order Issues">
          <Text style={styles.text}>
            If your request is related to an order, please include your
            Melo Order ID in your email. This helps our support team
            locate the transaction and resolve the issue faster.
          </Text>
        </Section>

        <Text style={styles.footer}>
          Melo support assists with platform-related issues including
          orders, payments, disputes, listings, and technical problems.
        </Text>
      </ScrollView>
    </View>
  )
}

/* ---------------- COMPONENT ---------------- */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4EF",
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F1E17",
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    lineHeight: 19,
    color: "#0F1E17",
  },

  list: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 13,
    lineHeight: 20,
    color: "#0F1E17",
  },

  email: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F7A63",
  },

  footer: {
    marginTop: 24,
    fontSize: 12,
    color: "#6B8F7D",
    textAlign: "center",
  },
})