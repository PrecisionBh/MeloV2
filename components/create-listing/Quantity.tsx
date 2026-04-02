import { StyleSheet, Text, TextInput, View } from "react-native"

type Props = {
  quantity: string
  setQuantity: (val: string) => void
}

export default function Quantity({ quantity, setQuantity }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <View style={styles.fieldTextWrap}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.helper}>
            Set how many units of this item you have available.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={(val) => {
            // only allow numbers
            const cleaned = val.replace(/[^0-9]/g, "")
            setQuantity(cleaned)
          }}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor="#A0A0A0"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
  },

  field: {
    width: "100%",
  },

  fieldTextWrap: {
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F1E17",
  },

  helper: {
    fontSize: 12,
    color: "#6B6B6B",
    marginTop: 2,
  },

  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E6EFEA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
})