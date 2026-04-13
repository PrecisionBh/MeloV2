import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import FilterBar, {
  FilterKey,
  type FilterOption,
} from "../components/home/FilterBar"
import ListingsGrid from "../components/home/ListingsGrid"
import SearchBar from "../components/home/SearchBar"
import SportFilterBar, {
  SportKey,
} from "../components/home/SportFilterBar"

import GlobalFooter from "../components/layout/GlobalFooter"
import GlobalHeader from "../components/layout/GlobalHeader"

import { Listing } from "../components/home/ListingCard"
import { useAuth } from "../context/AuthContext"
import { handleAppError } from "../lib/errors/appError"
import { SPORT_CATEGORY_MAP } from "../lib/sportCategories"
import { supabase } from "../lib/supabase"

/* ---------------- CATEGORY MAPS ---------------- */

const CUE_CATEGORIES = [
  "custom_cue",
  "playing_cue",
  "break_cue",
  "jump_cue",
]

const CASE_CATEGORIES = [
  "case",
  "hard_case",
  "soft_case",
]

/* ---------------- DB ROW TYPE ---------------- */

type ListingRow = {
  id: string
  title: string
  price: number
  category: string
  image_urls: string[] | null
  shipping_type?: "seller_pays" | "buyer_pays" | null
  user_id?: string
  is_boosted?: boolean | null
  is_mega_boost?: boolean | null
  created_at?: string
}

/* ---------------- SCREEN ---------------- */

export default function HomeScreen() {
  const router = useRouter()
  const { session } = useAuth()

  const [showAuthModal, setShowAuthModal] = useState(false)

  const [listings, setListings] = useState<Listing[]>([])
  const [allListings, setAllListings] = useState<ListingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)

  const [search, setSearch] = useState("")
  const [activeSport, setActiveSport] =
    useState<SportKey>("all")
  const [activeCategory, setActiveCategory] =
    useState<FilterKey>("all")

  const [hasUnreadMessages, setHasUnreadMessages] =
    useState(false)

  const [hasUnreadNotifications, setHasUnreadNotifications] =
    useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [megaBoostListings, setMegaBoostListings] =
    useState<Listing[]>([])

  const [page, setPage] = useState(0)
  const PAGE_SIZE = 25
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const threshold = 1000

    if (
      scrollOffset > threshold &&
      hasMore &&
      !loadingMore
    ) {
      loadMoreListings()
    }
  }, [scrollOffset, hasMore])

  const requireAuth = (action?: () => void) => {
    if (!session?.user) {
      setShowAuthModal(true)
      return
    }

    action?.()
  }

  /* ---------------- CATEGORY OPTIONS ---------------- */

  const categoryOptions = useMemo(() => {
    if (activeSport === "all") {
      return [
        { key: "all", label: "All" },
        { key: "cue", label: "Cue" },
        { key: "case", label: "Case" },
        { key: "shaft", label: "Shaft" },
        { key: "apparel", label: "Apparel" },
        { key: "accessories", label: "Accessories" },
        { key: "collectibles", label: "Collectibles" },
        { key: "other", label: "Other" },
      ] satisfies FilterOption[]
    }

    return (
      SPORT_CATEGORY_MAP[activeSport] ?? [
        { key: "all", label: "All" },
      ]
    ) as FilterOption[]
  }, [activeSport])

  useEffect(() => {
    setActiveCategory("all")
  }, [activeSport])

  /* ---------------- INITIAL LOAD ---------------- */

  useFocusEffect(
    useCallback(() => {
      if (listings.length === 0) {
        loadListings()
      }

      checkUnreadMessages()
      checkUnreadNotifications()
    }, [listings.length])
  )

  useEffect(() => {
    if (page === 0) return

    const fetchMore = async () => {
      await loadListings()
      setLoadingMore(false)
    }

    fetchMore()
  }, [page])

  /* ---------------- LOAD LISTINGS ---------------- */

  const loadListings = async () => {
    if (listings.length === 0) {
      setLoading(true)
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let followedSellerIds: string[] = []

      if (user) {
        const { data: followsData } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id)

        followedSellerIds =
          followsData?.map(
            (f: any) => f.following_id
          ) ?? []

        const { data: proData } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .maybeSingle()

        setIsPro(proData?.is_pro === true)
      } else {
        setIsPro(false)
      }

      const { data, error } = await supabase
        .from("listings")
        .select(
          "id,title,price,category,image_urls,shipping_type,user_id,is_boosted,is_mega_boost,created_at"
        )
        .eq("status", "active")
        .eq("is_sold", false)
        .eq("is_removed", false)
        .order("created_at", { ascending: false })
        .range(
          page * PAGE_SIZE,
          page * PAGE_SIZE + PAGE_SIZE - 1
        )

      if (error) throw error

      const rows = (data ?? []) as ListingRow[]

      const newAllListings = Array.from(
        new Map(
          [...allListings, ...rows].map((item) => [
            item.id,
            item,
          ])
        ).values()
      )

      setAllListings(newAllListings)

      setHasMore(rows.length === PAGE_SIZE)

      const validRows = newAllListings.filter(
        (l) =>
          Array.isArray(l.image_urls) &&
          l.image_urls.length > 0 &&
          l.title?.trim().length > 0 &&
          Number(l.price) > 0
      )

      const activeMegaBoostRows = validRows.filter(
        (l) => l.is_mega_boost === true
      )

      const boostedRows = validRows.filter(
        (l) => l.is_boosted === true
      )

      const nonBoostedRows = validRows.filter(
        (l) => !l.is_boosted
      )

      const followedRows = nonBoostedRows.filter((l) =>
        followedSellerIds.includes(l.user_id ?? "")
      )

      const newRows = nonBoostedRows.filter(
        (l) =>
          !followedSellerIds.includes(l.user_id ?? "")
      )

      const merged: ListingRow[] = []

      let bIndex = 0
      let fIndex = 0
      let nIndex = 0

      while (
        bIndex < boostedRows.length ||
        fIndex < followedRows.length ||
        nIndex < newRows.length
      ) {
        for (let i = 0; i < 3; i++) {
          if (bIndex < boostedRows.length)
            merged.push(boostedRows[bIndex++])
          else if (fIndex < followedRows.length)
            merged.push(followedRows[fIndex++])
          else if (nIndex < newRows.length)
            merged.push(newRows[nIndex++])
        }

        for (let i = 0; i < 3; i++) {
          if (fIndex < followedRows.length)
            merged.push(followedRows[fIndex++])
          else if (nIndex < newRows.length)
            merged.push(newRows[nIndex++])
          else if (bIndex < boostedRows.length)
            merged.push(boostedRows[bIndex++])
        }

        for (let i = 0; i < 3; i++) {
          if (nIndex < newRows.length)
            merged.push(newRows[nIndex++])
          else if (fIndex < followedRows.length)
            merged.push(followedRows[fIndex++])
          else if (bIndex < boostedRows.length)
            merged.push(boostedRows[bIndex++])
        }

        if (
          bIndex >= boostedRows.length &&
          fIndex >= followedRows.length &&
          nIndex >= newRows.length
        ) {
          break
        }
      }

      const normalized: Listing[] = merged.map((l) => ({
        id: l.id,
        title: l.title,
        price: Number(l.price),
        category: l.category ?? "",
        image_url: l.image_urls?.[0] ?? null,
        allow_offers: false,
        shipping_type: l.shipping_type ?? null,
      }))

      setListings(
        Array.from(
          new Map(
            normalized.map((item) => [item.id, item])
          ).values()
        )
      )

      setMegaBoostListings(
        activeMegaBoostRows.map((l) => ({
          id: l.id,
          title: l.title,
          price: Number(l.price),
          category: l.category ?? "",
          image_url: l.image_urls?.[0] ?? null,
          allow_offers: false,
          shipping_type: l.shipping_type ?? null,
        }))
      )
    } catch (err) {
      handleAppError(err, {
        fallbackMessage:
          "Failed to load listings. Please refresh and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMoreListings = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    setPage((prev) => prev + 1)
  }

  const refreshListings = async () => {
    setRefreshing(true)
    setPage(0)
    setHasMore(true)
    setAllListings([])
    await loadListings()
    setRefreshing(false)
  }

  /* ---------------- UNREAD CHECKS ---------------- */

  const checkUnreadMessages = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setHasUnreadMessages(false)
        return
      }

      const { data } = await supabase
        .from("messages")
        .select("id")
        .neq("sender_id", user.id)
        .is("read_at", null)
        .limit(1)

      setHasUnreadMessages(
        (data ?? []).length > 0
      )
    } catch {
      setHasUnreadMessages(false)
    }
  }

  const checkUnreadNotifications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setHasUnreadNotifications(false)
        return
      }

      const { count } = await supabase
        .from("notifications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("read", false)
        .or("cleared.is.null,cleared.eq.false")

      setHasUnreadNotifications(
        (count ?? 0) > 0
      )
    } catch {
      setHasUnreadNotifications(false)
    }
  }

  /* ---------------- FILTERED LISTINGS ---------------- */

  const filteredListings = useMemo(() => {
    let result = [...listings]

    if (search.trim()) {
      const q = search.toLowerCase().trim()

      result = result.filter((l) => {
        const title = (
          l.title ?? ""
        ).toLowerCase()
        const category = (
          l.category ?? ""
        ).toLowerCase()

        return (
          title.includes(q) ||
          category.includes(q)
        )
      })
    }

    return result
  }, [listings, search])

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <View style={styles.screen}>
        <GlobalHeader
          cartCount={0}
          notifCount={
            hasUnreadNotifications ? 1 : 0
          }
          onNotificationsPress={() =>
            requireAuth(() =>
              router.push("/notifications")
            )
          }
          onMessagesPress={() =>
            requireAuth(() =>
              router.push("/messages")
            )
          }
        />

        <View style={styles.filtersWrap}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search listings"
          />

          <SportFilterBar
            active={activeSport}
            onChange={setActiveSport}
          />

          <FilterBar
            active={activeCategory}
            onChange={setActiveCategory}
            options={categoryOptions}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <ListingsGrid
              listings={filteredListings}
              refreshing={refreshing}
              onRefresh={refreshListings}
              showUpgradeRow={!isPro}
              megaBoostListings={
                megaBoostListings
              }
              onScrollOffsetChange={
                setScrollOffset
              }
            />

            {loadingMore && (
              <ActivityIndicator
                style={{
                  marginVertical: 20,
                }}
              />
            )}
          </>
        )}

        <GlobalFooter cartCount={0} />
      </View>

      {showAuthModal && (
        <View style={styles.authOverlay}>
          <View style={styles.authModal}>
            <Text style={styles.authTitle}>
              Sign in to continue
            </Text>

            <TouchableOpacity
              style={styles.authBtn}
              onPress={() => {
                setShowAuthModal(false)
                router.push("/signinscreen")
              }}
            >
              <Text style={styles.authBtnText}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authBtnOutline}
              onPress={() => {
                setShowAuthModal(false)
                router.push("/register")
              }}
            >
              <Text
                style={
                  styles.authBtnOutlineText
                }
              >
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setShowAuthModal(false)
              }
            >
              <Text style={styles.authCancel}>
                Not now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    paddingBottom: 85,
  },

  filtersWrap: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
  },

  authOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  authModal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  authTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  authBtn: {
    width: "100%",
    backgroundColor: "#7FAF9B",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  authBtnText: {
    color: "#0F1E17",
    fontWeight: "800",
  },

  authBtnOutline: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#7FAF9B",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  authBtnOutlineText: {
    color: "#7FAF9B",
    fontWeight: "800",
  },

  authCancel: {
    marginTop: 12,
    color: "#999",
  },
})