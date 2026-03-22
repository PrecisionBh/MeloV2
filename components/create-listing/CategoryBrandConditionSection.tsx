import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
  sportType: string | null
  category: string | null
  brand: string | null
  condition: string | null
  onPressSportType: () => void
  onPressCategory: () => void
  onPressBrand: () => void
  onPressCondition: () => void
}

/* 🔥 VALUE → LABEL FORMATTERS */

const SPORT_LABEL_MAP: Record<string, string> = {
  baseball: "Baseball",
  billiards: "Billiards",
  bowling: "Bowling",
  boxing_mma: "Boxing / MMA",
  cornhole: "Cornhole",
  darts: "Darts",
  disc_golf: "Disc Golf",
  esports: "Esports / Gaming",
  football: "Football",
  golf: "Golf",
  hockey: "Hockey",
  skateboarding: "Skateboarding",
  soccer: "Soccer",
  softball: "Softball",
  sports_cards: "Sports Cards",
  tennis: "Tennis",
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
  /* Billiards */
  playing_cue: "Playing Cues",
  custom_cue: "Custom Cues",
  break_cue: "Break Cues",
  jump_cue: "Jump Cues",
  shaft: "Shafts",
  case: "Cue Cases",
  chalk: "Chalk",
  gloves: "Gloves",
  apparel: "Apparel",
  accessories: "Accessories",
  collectibles: "Collectibles",

  /* Golf */
  drivers: "Drivers",
  irons: "Irons",
  putters: "Putters",
  golf_bags: "Golf Bags",
  golf_balls: "Golf Balls",
  golf_accessories: "Golf Accessories",

  /* Baseball */
  baseball_bats: "Bats",
  baseball_gloves: "Gloves",
  baseball_cleats: "Cleats",
  baseball_helmets: "Helmets",
  baseball_apparel: "Apparel",
  baseball_accessories: "Accessories",

  /* Softball */
  softball_bats: "Bats",
  softball_gloves: "Gloves",
  softball_cleats: "Cleats",
  softball_helmets: "Helmets",
  softball_apparel: "Apparel",
  softball_accessories: "Accessories",

  /* Basketball */
  basketballs: "Basketballs",
  basketball_shoes: "Shoes",
  basketball_jerseys: "Jerseys",
  basketball_shorts: "Shorts",
  basketball_accessories: "Accessories",

  /* Football */
  football_helmets: "Helmets",
  football_pads: "Pads",
  football_gloves: "Gloves",
  football_cleats: "Cleats",
  football_jerseys: "Jerseys",

  /* Soccer */
  soccer_cleats: "Cleats",
  soccer_balls: "Balls",
  shin_guards: "Shin Guards",
  soccer_jerseys: "Jerseys",
  soccer_goalie: "Goalie Gear",

  /* Hockey */
  hockey_sticks: "Sticks",
  hockey_skates: "Skates",
  hockey_helmets: "Helmets",
  hockey_pads: "Pads",
  hockey_jerseys: "Jerseys",

  /* Tennis */
  tennis_rackets: "Rackets",
  tennis_balls: "Balls",
  tennis_shoes: "Shoes",
  tennis_bags: "Bags",
  tennis_accessories: "Accessories",

  /* Boxing / MMA */
  boxing_gloves: "Gloves",
  hand_wraps: "Hand Wraps",
  mma_gloves: "MMA Gloves",
  punching_bags: "Punching Bags",
  boxing_accessories: "Accessories",

  /* Skateboarding */
  decks: "Decks",
  trucks: "Trucks",
  wheels: "Wheels",
  complete_boards: "Complete Boards",
  skate_shoes: "Shoes",
  skate_accessories: "Accessories",

  /* Esports / Gaming */
  controllers: "Controllers",
  keyboards: "Keyboards",
  mice: "Mice",
  headsets: "Headsets",
  gaming_chairs: "Chairs",
  gaming_accessories: "Accessories",

  /* Sports Cards */
  graded_cards: "Graded Cards",
  raw_cards: "Raw Cards",
  sealed_boxes: "Sealed Boxes",
  packs: "Packs",
  card_supplies: "Supplies",
  card_collectibles: "Collectibles",

  /* Cornhole */
  cornhole_bags: "Cornhole Bags",
  cornhole_boards: "Boards",
  cornhole_sets: "Board Sets",
  cornhole_jerseys: "Jerseys",
  cornhole_accessories: "Accessories",

  /* Darts */
  steel_tip_darts: "Steel Tip Darts",
  soft_tip_darts: "Soft Tip Darts",
  dart_boards: "Dart Boards",
  dart_flights: "Flights",
  dart_shafts: "Shafts",
  dart_cases: "Cases",

  /* Disc Golf */
  disc_drivers: "Drivers",
  midrange_discs: "Midrange Discs",
  disc_putters: "Putters",
  disc_bags: "Disc Bags",
  disc_accessories: "Accessories",

  /* Bowling */
  bowling_balls: "Bowling Balls",
  bowling_bags: "Bowling Bags",
  bowling_shoes: "Shoes",
  bowling_accessories: "Accessories",

  other: "Other",
}

const CONDITION_LABEL_MAP: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
}

function formatSport(value: string | null) {
  if (!value) return "Select sport"
  return SPORT_LABEL_MAP[value] || value
}

function formatCategory(value: string | null) {
  if (!value) return "Select a category"
  return CATEGORY_LABEL_MAP[value] || value
}

function formatCondition(value: string | null) {
  if (!value) return "Select condition"
  return CONDITION_LABEL_MAP[value] || value
}

function formatBrand(value: string | null) {
  if (!value) return "Select a brand"

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function CategoryBrandConditionSection({
  sportType,
  category,
  brand,
  condition,
  onPressSportType,
  onPressCategory,
  onPressBrand,
  onPressCondition,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <Text style={styles.title}>Item Details</Text>
        <Text style={styles.subText}>
          Select sport, category, brand, and condition.
        </Text>

        <View style={styles.divider} />

        <Field
          label="Sport *"
          value={formatSport(sportType)}
          onPress={onPressSportType}
        />

        <Field
          label="Category *"
          value={formatCategory(category)}
          onPress={onPressCategory}
        />

        <Field
          label="Brand"
          value={formatBrand(brand)}
          onPress={onPressBrand}
        />

        <Field
          label="Condition *"
          value={formatCondition(condition)}
          onPress={onPressCondition}
        />
      </View>
    </View>
  )
}

function Field({
  label,
  value,
  onPress,
}: {
  label: string
  value: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={styles.field}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#7FAF9B" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: -16,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    paddingTop: 18,
    paddingBottom: 6,
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
    backgroundColor: "#E6ECE8",
    width: "100%",
    marginBottom: 6,
  },
  field: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#6B6B6B",
    marginBottom: 2,
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#0F1E17",
    fontWeight: "700",
  },
})