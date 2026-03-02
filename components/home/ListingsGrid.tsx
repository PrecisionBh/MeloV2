import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native"

import UpgradeToProButton from "../pro/UpgradeToProButton"
import ListingCard, { Listing } from "./ListingCard"
import MegaBoostBlock from "./MegaBoostBlock"; // 👑 NEW

/* 🧠 DEBUG IMPORT LOGS (CRITICAL FOR INVALID ELEMENT ERROR) */
console.log("🧩 ListingsGrid loaded")
console.log("🧩 ListingCard import:", ListingCard)
console.log("🧩 UpgradeToProButton import:", UpgradeToProButton)
console.log("🧩 MegaBoostBlock import:", MegaBoostBlock)

/* ---------------- TYPES ---------------- */

type Props = {
  listings: Listing[]
  refreshing: boolean
  onRefresh: () => void
  showUpgradeRow?: boolean
  megaBoostListings?: Listing[] // 👑 NEW
  onScrollOffsetChange?: (y: number) => void // 🧠 cache scroll
  initialScrollOffset?: number // 🧠 restore scroll
}

type GridRowItem =
  | { type: "row"; id: string; listings: Listing[] }
  | { type: "upgrade_row"; id: string }
  | { type: "mega_boost"; id: string; listings: Listing[] } // 👑 NEW

/* ---------------- COMPONENT ---------------- */

export default function ListingsGrid({
  listings,
  refreshing,
  onRefresh,
  showUpgradeRow = false,
  megaBoostListings = [],
  onScrollOffsetChange,
  initialScrollOffset = 0,
}: Props) {
  const router = useRouter()

  // 🧠 CRITICAL: FlatList ref for REAL scroll restoration (NOT initialScrollOffset)
  const flatListRef = useRef<FlatList<GridRowItem>>(null)
  const hasRestoredScroll = useRef(false)

  console.log("📦 ListingsGrid render start")
  console.log("📦 listings length:", listings?.length)
  console.log("📦 megaBoostListings length:", megaBoostListings?.length)
  console.log("📦 showUpgradeRow:", showUpgradeRow)
  console.log("🧠 initialScrollOffset:", initialScrollOffset)

  const NUM_COLUMNS = 3
  const MEGA_BOOST_FREQUENCY = 6 // 👑 Every 6th row

  // ✅ Build rows of 3 listings each
  const baseRows: GridRowItem[] = []
  let rowIndex = 0

  for (let i = 0; i < listings.length; i += NUM_COLUMNS) {
    const chunk = listings.slice(i, i + NUM_COLUMNS)
    baseRows.push({
      type: "row",
      id: `row-${rowIndex++}`,
      listings: chunk,
    })
  }

  console.log("🧱 Base rows built:", baseRows.length)

  // 👑 Inject Mega Boost rows every Nth row (without breaking grid)
  const rows: GridRowItem[] = []
  let megaIndex = 0

  baseRows.forEach((row, index) => {
    rows.push(row)

    const shouldInsertMega =
      megaBoostListings.length > 0 &&
      (index + 1) % MEGA_BOOST_FREQUENCY === 0

    if (shouldInsertMega) {
      const sliceStart = megaIndex * 6
      const sliceEnd = sliceStart + 6
      const megaSlice = megaBoostListings.slice(sliceStart, sliceEnd)

      console.log("👑 Checking Mega Boost insertion at row:", index)
      console.log("👑 Mega slice length:", megaSlice.length)

      if (megaSlice.length > 0) {
        rows.push({
          type: "mega_boost",
          id: `mega-boost-${index}`,
          listings: megaSlice,
        })
        megaIndex++
      }
    }
  })

  // ✅ Insert Upgrade row at 5th row position (index 4)
  if (showUpgradeRow) {
    const insertAt = Math.min(4, rows.length)
    console.log("⭐ Inserting Upgrade Row at index:", insertAt)
    rows.splice(insertAt, 0, { type: "upgrade_row", id: "upgrade-row" })
  }

  console.log("📦 Final rows count:", rows.length)

  /* 🧠 RESTORE SCROLL POSITION AFTER DATA IS READY (MARKETPLACE-GRADE FIX) */
  useEffect(() => {
    if (!flatListRef.current) return
    if (hasRestoredScroll.current) return
    if (rows.length === 0) return
    if (!initialScrollOffset || initialScrollOffset <= 0) return

    console.log("🧠 Restoring scroll to:", initialScrollOffset)

    // Delay ensures FlatList layout is calculated
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: initialScrollOffset,
        animated: false,
      })
      hasRestoredScroll.current = true
    }, 50)

    return () => clearTimeout(timeout)
  }, [rows.length, initialScrollOffset])

  return (
    <FlatList
      ref={flatListRef} // 🧠 REQUIRED for true scroll restore
      data={rows}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16} // 60fps scroll tracking
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = e.nativeEvent.contentOffset.y
        onScrollOffsetChange?.(y) // 🧠 SAVE scroll position in cache
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#0F1E17"
        />
      }
      renderItem={({ item, index }) => {
        console.log("🧩 Rendering item index:", index, "type:", item.type)

        try {
          // 👑 FULL WIDTH MEGA BOOST BLOCK
          if (item.type === "mega_boost") {
            return (
              <View style={styles.fullRow}>
                <MegaBoostBlock listings={item.listings} />
              </View>
            )
          }

          // ⭐ FULL WIDTH UPGRADE ROW
          if (item.type === "upgrade_row") {
            return (
              <View style={styles.fullRow}>
                <UpgradeToProButton />
              </View>
            )
          }

          // 🃏 NORMAL 3-COLUMN ROW
          return (
            <View style={styles.row}>
              {item.listings.map((l, cardIndex) => (
                <View key={l.id} style={styles.cardWrap}>
                  <ListingCard
                    listing={l}
                    onPress={() => router.push(`/listing/${l.id}`)}
                  />
                </View>
              ))}

              {/* Fill empty columns for perfect grid spacing */}
              {item.listings.length < NUM_COLUMNS
                ? Array.from({
                    length: NUM_COLUMNS - item.listings.length,
                  }).map((_, idx) => (
                    <View
                      key={`spacer-${item.id}-${idx}`}
                      style={styles.cardWrap}
                    />
                  ))
                : null}
            </View>
          )
        } catch (err) {
          console.error("💥 RENDER CRASH SOURCE (ListingsGrid):", err)
          console.error("💥 Item that caused crash:", item)
          return null
        }
      }}
    />
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 3,
    paddingTop: 4,
    paddingBottom: 140,
  },
  row: {
    flexDirection: "row",
    gap: 4,
    width: "100%",
    marginBottom: 4,
  },
  cardWrap: {
    flex: 1,
  },
  fullRow: {
    width: "100%",
    paddingHorizontal: 3,
    marginVertical: 6,
  },
})