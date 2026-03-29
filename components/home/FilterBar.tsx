import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export type FilterKey =
  | "all"
  | "cue"
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

export type FilterOption = {
  key: FilterKey
  label: string
}

type Props = {
  active: FilterKey
  onChange: (key: FilterKey) => void
  options?: FilterOption[]
}

const FILTERS: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "cue", label: "Cue" },
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

export default function FilterBar({
  active,
  onChange,
  options,
}: Props) {
  const filtersToRender = options?.length ? options : FILTERS

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {filtersToRender.map((f) => {
          const isActive = active === f.key

          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.pill,
                isActive && styles.activePill,
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
    marginTop: 4,

    backgroundColor: "#ffffff",
    borderRadius: 16,
    height: 44,

    justifyContent: "center",

    // ✅ keeps pills inside rounded edges
    overflow: "hidden",

    // subtle depth like search bar
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  scroll: {
    gap: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  pill: {
    backgroundColor: "#F3F6F4",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  activePill: {
    backgroundColor: "#7FAF9B",
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