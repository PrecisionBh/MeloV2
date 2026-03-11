import { useRouter } from "expo-router"
import React from "react"

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"

export default function AboutMeloScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      {/* STANDARDIZED HEADER */}
      <AppHeader
        title="About Melo"
        backLabel="Legal"
        backRoute="/legal"
      />

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="What is Melo?">
  <Text style={styles.text}>
    Melo is a peer-to-peer marketplace where people buy and sell directly
    with each other. Melo provides the platform, payment protection, and
    dispute tools that help keep both buyers and sellers safe during
    transactions.
  </Text>

  <Text style={styles.text}>
    Sellers list items for sale. Buyers purchase those items. Melo manages
    the order process, payment protection, and communication tools so both
    parties can complete the transaction with more confidence.
  </Text>
</Section>

<Section title="Our Mission">
  <Text style={styles.text}>
    Our mission is to make online peer-to-peer transactions safer,
    simpler, and more transparent. Melo was built to reduce scams,
    confusion, and uncertainty when buying or selling online.
  </Text>

  <Text style={styles.text}>
    We do this by combining escrow-based payments, shipment tracking,
    clear order timelines, and structured dispute resolution all within
    one platform.
  </Text>
</Section>

<Section title="How Melo Works">
  <Text style={styles.text}>
    Melo connects buyers and sellers directly. When an order is placed,
    the process works like this:
  </Text>

  <Text style={styles.list}>
    • Buyer purchases an item{"\n"}
    • Payment is securely held in escrow{"\n"}
    • Seller ships the item with tracking{"\n"}
    • Buyer receives and inspects the item{"\n"}
    • Funds are released to the seller when the order is completed
  </Text>

  <Text style={styles.text}>
    This process helps reduce fraud and protects both parties during the
    transaction.
  </Text>
</Section>

<Section title="What Escrow Means">
  <Text style={styles.text}>
    Escrow means the buyer’s payment is temporarily held while the order
    is being completed.
  </Text>

  <Text style={styles.text}>
    Instead of the seller receiving payment immediately, the funds are
    held securely until the item is shipped and the buyer receives the
    order.
  </Text>

  <Text style={styles.text}>
    Once the transaction is successfully completed, the payment is
    released to the seller.
  </Text>

  <Text style={styles.text}>
    If a problem occurs, the payment can remain frozen while the issue is
    reviewed through the dispute process.
  </Text>
</Section>

<Section title="Marketplace Fees">
  <Text style={styles.text}>
    Melo charges a small fee to sellers when an item sells on the
    platform.
  </Text>

  <Text style={styles.list}>
    • Standard sellers pay a 5% selling fee{"\n"}
    • Melo Pro members pay a reduced 3.5% selling fee
  </Text>

  <Text style={styles.text}>
    These fees help support the platform, payment protection, dispute
    systems, and ongoing development of the marketplace.
  </Text>
</Section>

<Section title="Melo Pro Membership">
  <Text style={styles.text}>
    Melo Pro is an optional membership designed for active sellers who
    want lower fees and additional marketplace tools.
  </Text>

  <Text style={styles.text}>
    Pro members receive a reduced seller fee and access to certain
    promotional features that can help increase visibility for their
    listings.
  </Text>
</Section>

<Section title="Boosts & Mega Boosts">
  <Text style={styles.text}>
    Melo offers promotional tools called Boosts and Mega Boosts that
    help sellers increase the visibility of their listings.
  </Text>

  <Text style={styles.list}>
    • A Boost temporarily increases the exposure of a listing so it
    appears higher in marketplace feeds.{"\n"}
    • A Mega Boost provides even greater visibility and may place the
    listing in featured areas of the platform.
  </Text>

  <Text style={styles.text}>
    Boosts are optional promotional tools designed to help listings
    reach more potential buyers. They do not guarantee a sale.
  </Text>
</Section>

<Section title="What Melo Is Not">
  <Text style={styles.text}>
    Melo does not own, store, inspect, or ship the items listed on the
    platform. All items are listed and shipped by independent sellers.
  </Text>

  <Text style={styles.text}>
    Melo provides the marketplace platform and tools that help buyers
    and sellers complete transactions more safely.
  </Text>
</Section>

<Section title="Disputes & Buyer Protection">
  <Text style={styles.text}>
    If a problem occurs during a transaction, buyers and sellers can
    open a dispute through the platform.
  </Text>

  <Text style={styles.text}>
    During a dispute, both parties may submit evidence and explanations.
    Melo may review this information to help determine a fair outcome
    according to marketplace policies.
  </Text>

  <Text style={styles.text}>
    While escrow and dispute tools provide protection, Melo cannot
    guarantee outcomes for every situation.
  </Text>
</Section>

<Section title="Trust & Transparency">
  <Text style={styles.text}>
    Melo provides tools that allow users to track orders, review
    shipping updates, communicate through the platform, and document
    transactions clearly.
  </Text>

  <Text style={styles.text}>
    These tools are designed to create transparency and reduce
    misunderstandings between buyers and sellers.
  </Text>
</Section>

<Section title="Community Responsibility">
  <Text style={styles.text}>
    Melo depends on honest participation from its users. Fraud,
    misrepresentation, harassment, or abuse of the platform may result
    in listing removal, account suspension, or permanent account
    termination.
  </Text>
</Section>

<Section title="Payments & Security">
  <Text style={styles.text}>
    Payments on Melo are processed through secure third-party payment
    providers. Melo does not store full payment card details.
  </Text>

  <Text style={styles.text}>
    Payment processing, transaction security, and financial compliance
    are handled by these payment providers.
  </Text>
</Section>

<Section title="Our Commitment">
  <Text style={styles.text}>
    Melo is committed to improving marketplace safety, transparency,
    and user experience as the platform grows.
  </Text>
</Section>
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

  footer: {
    marginTop: 24,
    fontSize: 12,
    color: "#6B8F7D",
    textAlign: "center",
  },
})
