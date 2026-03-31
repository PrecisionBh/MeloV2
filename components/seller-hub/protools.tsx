import ProQuickActions from "@/components/prodashboard/ProQuickActions"
import { StyleSheet, View } from "react-native"

type Props = {
  isPro: boolean
}

export default function ProTools({ isPro }: Props) {
  return (
    <View style={styles.wrap}>
      <ProQuickActions isPro={isPro} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
})