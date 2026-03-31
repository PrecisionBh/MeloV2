import { useRouter } from "expo-router"
import { StyleSheet, View } from "react-native"

import BoostsCard from "@/components/prodashboard/BoostsCard"

type Props = {
  userId: string
  boostsRemaining: number
  megaBoostsRemaining: number // ✅ ADDED
  lastBoostReset: string | null
  isPro: boolean
}

export default function ProDashboardSection({
  userId,
  boostsRemaining,
  megaBoostsRemaining, // ✅ ADDED
  lastBoostReset,
  isPro,
}: Props) {
  const router = useRouter()

  return (
    <View style={styles.wrap}>
      {/* 🚀 Boost Power Card */}
      <BoostsCard
        userId={userId}
        boostsRemaining={boostsRemaining}
        megaBoostsRemaining={megaBoostsRemaining} // ✅ PASS IT DOWN
        lastBoostReset={lastBoostReset}
        onPressBoost={() => {
          if (!isPro) return
          router.push("/seller-hub/my-listings")
        }}
      />

      <View style={styles.bottomSpacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  bottomSpacer: {
    height: 10,
  },
})