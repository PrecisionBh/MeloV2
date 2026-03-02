import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export type FilterKey =
  | "all"
  | "playing_cue"
  | "custom_cue"
  | "break_cue"
  | "jump_cue"
  | "case"
  | "shaft"
  | "apparel"
  | "accessories"
  | "collectibles"
  | "other"

type Props = {
  active: FilterKey
  onChange: (key: FilterKey) => void
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "playing_cue", label: "Playing Cue" },
  { key: "custom_cue", label: "Custom Cue" },
  { key: "break_cue", label: "Break Cue" },
  { key: "jump_cue", label: "Jump Cue" },
  { key: "case", label: "Case" },
  { key: "shaft", label: "Shaft" },
  { key: "apparel", label: "Apparel" },
  { key: "accessories", label: "Accessories" },
  { key: "collectibles", label: "Collectible" },
  { key: "other", label: "Other" },
]

export default function FilterBar({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {FILTERS.map((f) => {
          const isActive = active === f.key

          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.pill,
                isActive && styles.activePill,
                isActive && styles.glow,
              ]}
              onPress={() => onChange(f.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {f.label}
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
    backgroundColor: "#7FAF9B", // header sage (Melo brand)
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

    // Light depth (clean marketplace look)
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Active state (matches your current Melo style)
  activePill: {
    backgroundColor: "#00ff88",
  },

  // Glow (unchanged)
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