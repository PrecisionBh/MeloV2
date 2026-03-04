import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

type Props = {
  shippingType: "seller_pays" | "buyer_pays" | null
  setShippingType: (v: "seller_pays" | "buyer_pays") => void
  shippingPrice: string
  setShippingPrice: (v: string) => void
}

export default function ShippingSection({
  shippingType,
  setShippingType,
  shippingPrice,
  setShippingPrice,
}: Props) {
  const isBuyerPays = shippingType === "buyer_pays"
  const isSellerPays = shippingType === "seller_pays"

  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        {/* Header */}
        <Text style={styles.title}>Shipping *</Text>
        <Text style={styles.subText}>
          Choose who pays for shipping on this item.
        </Text>

        <View style={styles.divider} />

        {/* SELLER PAYS OPTION */}
        <TouchableOpacity
          style={[
            styles.optionRow,
            isSellerPays && styles.optionRowActive,
          ]}
          onPress={() => {
            setShippingType("seller_pays")
            setShippingPrice("")
          }}
          activeOpacity={0.85}
        >
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Free Shipping</Text>
            <Text style={styles.optionHelper}>
              You cover the shipping cost (recommended for better sales)
            </Text>
          </View>

          <View
            style={[
              styles.toggle,
              isSellerPays && styles.toggleActive,
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                isSellerPays && styles.toggleKnobActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* BUYER PAYS OPTION */}
        <TouchableOpacity
          style={[
            styles.optionRow,
            isBuyerPays && styles.optionRowActive,
          ]}
          onPress={() => setShippingType("buyer_pays")}
          activeOpacity={0.85}
        >
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Buyer Pays Shipping</Text>
            <Text style={styles.optionHelper}>
              Set a flat shipping price for the buyer
            </Text>
          </View>

          <View
            style={[
              styles.toggle,
              isBuyerPays && styles.toggleActive,
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                isBuyerPays && styles.toggleKnobActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* SHIPPING PRICE INPUT */}
        {isBuyerPays && (
          <View style={styles.priceWrap}>
            <Text style={styles.priceLabel}>Shipping Price *</Text>

            <TextInput
              style={styles.priceInput}
              value={shippingPrice}
              onChangeText={setShippingPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: -16,
    backgroundColor: "#FFFFFF",
  },

  inner: {
    paddingTop: 18,
    paddingBottom: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F1E17",
    paddingHorizontal: 16,
    marginBottom: 2,
  },

  subText: {
    fontSize: 12,
    color: "#323232",
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    width: "100%",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
  },

  optionRowActive: {
    backgroundColor: "#F4FAF7",
  },

  optionTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1E17",
    marginBottom: 2,
  },

  optionHelper: {
    fontSize: 12,
    color: "#6B6B6B",
  },

  /* Toggle Switch */
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 14,
    backgroundColor: "#DADADA",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  toggleActive: {
    backgroundColor: "#7FAF9B",
  },

  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },

  toggleKnobActive: {
    alignSelf: "flex-end",
  },

  priceWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },

  priceLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F1E17",
    marginBottom: 6,
  },

  priceInput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#DADADA",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F1E17",
  },
})