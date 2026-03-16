import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

export type SportKey =
  | "all"
  | "billiards"
  | "golf"
  | "baseball_softball"
  | "cornhole"
  | "darts"
  | "disc_golf"
  | "bowling"

type Props = {
  active: SportKey
  onChange: (key: SportKey) => void
}

const SPORTS: { key: SportKey; label: string }[] = [
  { key: "all", label: "All Sports" },
  { key: "billiards", label: "Billiards" },
  { key: "golf", label: "Golf" },
  { key: "baseball_softball", label: "Baseball" },
  { key: "cornhole", label: "Cornhole" },
  { key: "darts", label: "Darts" },
  { key: "disc_golf", label: "Disc Golf" },
  { key: "bowling", label: "Bowling" },
]

export default function SportFilterBar({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SPORTS.map((s) => {
          const isActive = active === s.key

          return (
            <TouchableOpacity
              key={s.key}
              style={[
                styles.pill,
                isActive && styles.activePill,
                isActive && styles.glow,
              ]}
              onPress={() => onChange(s.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#7FAF9B", // Melo header sage
    paddingVertical: 8,
    paddingLeft: 12,
  },

  scroll: {
    gap: 8,
    paddingRight: 12,
  },

  pill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,

    // Light depth
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  activePill: {
    backgroundColor: "#00ff88",
  },

  glow: {
    shadowColor: "#ccff00",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },

  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E1E1E",
  },

  activeText: {
    color: "#0F1E17",
  },
})