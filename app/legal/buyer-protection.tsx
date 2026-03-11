import { useRouter } from "expo-router"
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"

export default function BuyerProtectionScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Buyer Protection"
        backLabel="Legal"
        backRoute="/legal"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Why Buying on Melo Is Safer">
          <Text style={styles.text}>
            Melo is designed to make buying from independent sellers safer
            than traditional peer-to-peer marketplaces.
          </Text>

          <Text style={styles.text}>
            Instead of sending money directly to a seller and hoping
            everything goes well, Melo protects your purchase using escrow
            payments, delivery tracking, and a structured dispute process.
          </Text>

          <Text style={styles.text}>
            These protections help ensure that sellers deliver what was
            promised and that buyers have a clear path to resolve issues if
            something goes wrong.
          </Text>
        </Section>

        <Section title="Escrow Protection">
          <Text style={styles.text}>
            When you purchase an item on Melo, your payment is placed into
            escrow.
          </Text>

          <Text style={styles.text}>
            Escrow means your payment is securely held while the
            transaction takes place. The seller does not receive the funds
            immediately.
          </Text>

          <Text style={styles.text}>
            The payment remains protected until the item is shipped,
            delivered, and the order is successfully completed.
          </Text>

          <Text style={styles.text}>
            This system protects buyers by preventing sellers from
            receiving funds before the transaction is finished.
          </Text>
        </Section>

        <Section title="Delivery & Inspection Period">
          <Text style={styles.text}>
            Once the order is marked as delivered, buyers have an
            inspection period to review their purchase.
          </Text>

          <Text style={styles.text}>
            During this time you should confirm that the item matches the
            listing description and arrived in the expected condition.
          </Text>

          <Text style={styles.list}>
            • Confirm the order is complete{"\n"}
            • Report a problem if something is wrong{"\n"}
            • Initiate a return during the inspection period
          </Text>

          <Text style={styles.text}>
            If no issues are reported during the inspection window, the
            payment is automatically released to the seller.
          </Text>
        </Section>

        <Section title="Easy Returns During Inspection">
          <Text style={styles.text}>
            Melo gives buyers a simple and powerful way to protect their
            purchase.
          </Text>

          <Text style={styles.text}>
            During the inspection period after delivery, buyers may start
            a return directly from the order page. A return request does
            not require seller approval.
          </Text>

          <Text style={styles.text}>
            Buyers simply tap the “Return Item” option and follow the
            return instructions. Once a return is started, escrow funds
            remain frozen until the item is returned or the situation is
            resolved.
          </Text>

          <Text style={styles.text}>
            This is extremely important for peer-to-peer marketplaces.
            Allowing buyers to easily return items during the inspection
            period significantly reduces disputes and protects buyers from
            being stuck with items that are not as described.
          </Text>

          <Text style={styles.text}>
            This system gives buyers strong protection over their money
            while still maintaining a structured process that keeps
            transactions fair for both parties.
          </Text>
        </Section>

        <Section title="Reporting a Problem">
          <Text style={styles.text}>
            If your order arrives damaged, incorrect, or significantly
            different from the listing description, you can report an
            issue directly from your order page.
          </Text>

          <Text style={styles.text}>
            Once an issue is reported, escrow funds remain frozen while
            the situation is reviewed.
          </Text>

          <Text style={styles.text}>
            Buyers and sellers may submit photos, messages, tracking
            information, and other evidence to support their case.
          </Text>
        </Section>

        <Section title="Dispute Resolution">
          <Text style={styles.text}>
            If a problem cannot be resolved between the buyer and seller,
            a formal dispute may be opened.
          </Text>

          <Text style={styles.text}>
            Melo may review evidence such as listing descriptions,
            shipment tracking, photos, and communication history to help
            determine a fair outcome according to marketplace policies.
          </Text>

          <Text style={styles.text}>
            Only one dispute may be opened per order.
          </Text>
        </Section>

        <Section title="Refund Outcomes">
          <Text style={styles.text}>
            If a return or dispute results in a refund, the refunded
            amount may include the purchase price and applicable sales
            taxes.
          </Text>

          <Text style={styles.text}>
            Certain fees are non-refundable because they cover services
            that have already been provided.
          </Text>

          <Text style={styles.list}>
            Refundable amounts may include:{"\n"}
            • Item purchase price{"\n"}
            • Applicable sales taxes
          </Text>

          <Text style={styles.list}>
            Non-refundable amounts may include:{"\n"}
            • Buyer Protection Fee{"\n"}
            • Payment processing fees{"\n"}
            • Shipping costs
          </Text>
        </Section>

        <Section title="What Buyer Protection Does Not Cover">
          <Text style={styles.text}>
            Buyer Protection does not cover:
          </Text>

          <Text style={styles.list}>
            • Buyer remorse or change of mind{"\n"}
            • Damage occurring after delivery{"\n"}
            • Issues disclosed in the listing{"\n"}
            • Items that violate Melo marketplace policies
          </Text>
        </Section>

        <Section title="Buyer Responsibility">
          <Text style={styles.text}>
            Buyers are responsible for reviewing listings carefully,
            reading item descriptions, asking questions before purchase,
            and reporting issues within the allowed inspection timeframe.
          </Text>
        </Section>

        <Section title="Buyer Protection Fee">
          <Text style={styles.text}>
            Melo charges a small Buyer Protection Fee to help fund secure
            transactions and payment protection infrastructure.
          </Text>

          <Text style={styles.text}>
            This fee is currently 1.5% of the purchase price and supports
            the escrow system, dispute tools, and buyer safety features
            built into the marketplace.
          </Text>
        </Section>

        <Section title="Payment Processing & Taxes">
          <Text style={styles.text}>
            Payments made on Melo may include standard payment processing
            fees charged by third-party payment providers.
          </Text>

          <Text style={styles.text}>
            Buyers are also responsible for applicable sales taxes
            required by federal, state, or local laws depending on the
            purchase location.
          </Text>

          <Text style={styles.text}>
            Taxes are calculated and collected where required in
            accordance with applicable tax regulations.
          </Text>
        </Section>

        <Text style={styles.footer}>
          Buyer Protection applies only to purchases completed through
          the Melo platform.
        </Text>
      </ScrollView>
    </View>
  )
}

/* COMPONENT */

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

/* STYLES */

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
    marginTop: 20,
    fontSize: 12,
    color: "#6B8F7D",
    textAlign: "center",
  },
})