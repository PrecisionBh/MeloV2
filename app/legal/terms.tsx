import { useRouter } from "expo-router"
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import AppHeader from "@/components/app-header"

export default function TermsScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Terms & Conditions"
        backLabel="Legal"
        backRoute="/legal"
      />

      <ScrollView contentContainerStyle={styles.content}>

        <Section title="1. Acceptance of Terms">
          <Text style={styles.text}>
            By accessing or using the Melo marketplace (“Melo”, “we”, “our”, or “us”),
            you agree to be bound by these Terms & Conditions. If you do not agree
            to these terms, you may not use the platform.
          </Text>
        </Section>

        <Section title="2. Eligibility">
          <Text style={styles.text}>
            Users must be at least 18 years old to sell items on Melo or receive payouts.
          </Text>

          <Text style={styles.text}>
            By creating an account, listing items, or selling on the platform,
            you represent and warrant that you are legally capable of entering
            into binding agreements.
          </Text>

          <Text style={styles.text}>
            Melo may request identity verification or additional information
            before allowing withdrawals or payouts.
          </Text>
        </Section>

        <Section title="3. Melo’s Role as a Marketplace">
          <Text style={styles.text}>
            Melo is a peer-to-peer marketplace platform that connects buyers
            and sellers. Melo is not the seller, buyer, manufacturer,
            warehouse, shipper, carrier, authenticator, bank, or financial institution.
          </Text>

          <Text style={styles.text}>
            All transactions occur directly between independent users.
            Melo provides the platform, escrow payment tools, and dispute
            resolution systems that help facilitate these transactions.
          </Text>
        </Section>

        <Section title="4. Listings & Seller Responsibilities">
          <Text style={styles.text}>
            Sellers are solely responsible for their listings and the items they sell.
          </Text>

          <Text style={styles.list}>
            Sellers must ensure:{"\n"}
            • Listings are accurate and truthful{"\n"}
            • Items are legally owned and permitted for sale{"\n"}
            • Items match the description and condition provided{"\n"}
            • Orders are shipped promptly with valid tracking
          </Text>

          <Text style={styles.text}>
            Sellers are also responsible for complying with all applicable laws
            including tax obligations.
          </Text>
        </Section>

        <Section title="5. Prohibited Items & Conduct">
          <Text style={styles.text}>
            The following items and activities are prohibited on Melo:
          </Text>

          <Text style={styles.list}>
            • Illegal or stolen goods{"\n"}
            • Counterfeit or infringing products{"\n"}
            • Weapons, drugs, or regulated substances{"\n"}
            • Fraudulent listings or misrepresentation{"\n"}
            • Off-platform payment solicitation
          </Text>

          <Text style={styles.text}>
            Melo reserves the right to remove listings or suspend accounts
            that violate these rules.
          </Text>
        </Section>

        <Section title="6. Orders, Payments & Escrow">
          <Text style={styles.text}>
            Payments made on Melo are held in escrow until the transaction
            is completed.
          </Text>

          <Text style={styles.text}>
            Escrow means the buyer’s payment is temporarily held while
            the seller ships the item and the buyer receives the order.
          </Text>

          <Text style={styles.text}>
            Funds may remain frozen during disputes, returns, or fraud
            reviews when necessary.
          </Text>
        </Section>

        <Section title="7. Delivery, Inspection & Returns">
          <Text style={styles.text}>
            After an order is delivered, buyers are provided an inspection
            period to review the item.
          </Text>

          <Text style={styles.text}>
            During this period, buyers may confirm the order or initiate
            a return directly from the order page.
          </Text>

          <Text style={styles.text}>
            Returns initiated during the inspection window do not require
            seller approval.
          </Text>
        </Section>

        <Section title="8. Disputes">
          <Text style={styles.text}>
            If an issue cannot be resolved between a buyer and seller,
            a dispute may be opened. Only one dispute may be opened per order.
          </Text>

          <Text style={styles.text}>
            Melo may review available evidence including messages,
            listing information, photos, and shipment tracking to
            determine a resolution.
          </Text>

          <Text style={styles.text}>
            Dispute decisions are made based on available information
            and are considered final.
          </Text>
        </Section>

        <Section title="9. Fees">
          <Text style={styles.text}>
            Melo charges certain marketplace fees for use of the platform.
          </Text>

          <Text style={styles.list}>
            • Seller fee: 5% per completed sale{"\n"}
            • Melo Pro seller fee: 3.5% per sale{"\n"}
            • Buyer Protection Fee: 1.5% of purchase price
          </Text>

          <Text style={styles.text}>
            Additional payment processing fees or instant payout fees
            may apply depending on the payment method used.
          </Text>

          <Text style={styles.text}>
            Applicable taxes may also be collected where required by law.
          </Text>
        </Section>

        <Section title="10. Payouts">
          <Text style={styles.text}>
            Seller payouts are processed securely through Stripe or other
            authorized payment partners.
          </Text>

          <Text style={styles.text}>
            Standard payouts are free. Instant payouts may include
            processing fees charged by the payment provider.
          </Text>

          <Text style={styles.text}>
            Melo may delay, hold, or reverse payouts when necessary
            for fraud prevention, disputes, chargebacks, or compliance reviews.
          </Text>
        </Section>

        <Section title="11. Boosts & Promotions">
          <Text style={styles.text}>
            Boosts and Mega Boosts are promotional tools designed to increase
            listing visibility within the marketplace.
          </Text>

          <Text style={styles.text}>
            These promotional features do not guarantee visibility,
            traffic, or sales.
          </Text>
        </Section>

        <Section title="12. Account Suspension">
          <Text style={styles.text}>
            Melo reserves the right to suspend, restrict, or terminate
            accounts at its discretion for violations of these Terms,
            fraudulent activity, abuse of the platform, or risk to the
            marketplace.
          </Text>
        </Section>

        <Section title="13. Disclaimers">
          <Text style={styles.text}>
            The Melo platform is provided “as is” and “as available”.
            Melo makes no guarantees regarding uninterrupted service,
            error-free operation, or transaction outcomes.
          </Text>
        </Section>

        <Section title="14. Limitation of Liability">
          <Text style={styles.text}>
            To the fullest extent permitted by law, Melo shall not be liable
            for indirect, incidental, special, or consequential damages
            arising from the use of the platform.
          </Text>
        </Section>

        <Section title="15. Indemnification">
          <Text style={styles.text}>
            Users agree to indemnify and hold harmless Melo from any claims,
            damages, liabilities, or expenses arising from their use of
            the platform or violation of these Terms.
          </Text>
        </Section>

        <Section title="16. Governing Law">
          <Text style={styles.text}>
            These Terms shall be governed by the laws applicable in the
            jurisdiction where Melo operates, without regard to conflict
            of law principles.
          </Text>
        </Section>

        <Section title="17. Changes to Terms">
          <Text style={styles.text}>
            Melo may update these Terms periodically. Continued use of the
            platform after changes are posted constitutes acceptance of
            the updated Terms.
          </Text>
        </Section>

        <Section title="18. Contact">
          <Text style={styles.text}>
            If you have questions regarding these Terms, please contact:
          </Text>

          <Text style={styles.list}>
            support@melomarketplace.app
          </Text>
        </Section>

        <Text style={styles.footer}>
          Last updated: {new Date().getFullYear()}
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