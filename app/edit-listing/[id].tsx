// app/edit-listing.tsx (IDENTICAL UI TO CREATE LISTING — EDIT MODE)

import AppHeader from "@/components/app-header"
import CategoryBrandConditionSection from "@/components/create-listing/CategoryBrandConditionSection"
import CreateListingFooter from "@/components/create-listing/CreateListingFooter"
import FullScreenSelector from "@/components/create-listing/FullScreenSelector"
import ImageUpload from "@/components/create-listing/ImageUpload"
import PriceOffersSection from "@/components/create-listing/PriceOffersSection"
import Quantity from "@/components/create-listing/Quantity"
import ShippingSection from "@/components/create-listing/ShippingSection"
import TitleDescriptionSection from "@/components/create-listing/TitleDescriptionSection"
import ReturnAddressRequiredModal from "@/components/modals/ReturnAddressRequiredModal"
import { useAuth } from "@/context/AuthContext"
import { handleAppError } from "@/lib/errors/appError"
import { supabase } from "@/lib/supabase"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

type ProfileRow = {
  is_pro: boolean | null
  boosts_remaining: number | null
  mega_boosts_remaining: number | null
}

type SelectorOption = {
  label: string
  value: string
  subtext?: string
}

/* ---------------- SELECTOR DATA ---------------- */

const SPORT_TYPES: SelectorOption[] = [
  { label: "Baseball", value: "baseball" },
  { label: "Billiards", value: "billiards" },
  { label: "Bowling", value: "bowling" },
  { label: "Boxing / MMA", value: "boxing_mma" },
  { label: "Cornhole", value: "cornhole" },
  { label: "Darts", value: "darts" },
  { label: "Disc Golf", value: "disc_golf" },
  { label: "Esports / Gaming", value: "esports" },
  { label: "Football", value: "football" },
  { label: "Golf", value: "golf" },
  { label: "Hockey", value: "hockey" },
  { label: "Skateboarding", value: "skateboarding" },
  { label: "Soccer", value: "soccer" },
  { label: "Softball", value: "softball" },
  { label: "Sports Cards", value: "sports_cards" },
  { label: "Tennis", value: "tennis" },
]

/* ---------------- SPORT → CATEGORY MAP ---------------- */

const SPORT_CATEGORY_MAP: Record<string, SelectorOption[]> = {

  billiards: [
    { label: "Playing Cues", value: "playing_cue" },
    { label: "Custom Cues", value: "custom_cue" },
    { label: "Break Cues", value: "break_cue" },
    { label: "Jump Cues", value: "jump_cue" },
    { label: "Shafts", value: "shaft" },
    { label: "Cue Cases", value: "case" },
    { label: "Chalk", value: "chalk" },
    { label: "Gloves", value: "gloves" },
    { label: "Apparel", value: "apparel" },
    { label: "Accessories", value: "accessories" },
    { label: "Collectibles", value: "collectibles" },
    { label: "Other", value: "other" },
  ],

  golf: [
    { label: "Drivers", value: "drivers" },
    { label: "Irons", value: "irons" },
    { label: "Putters", value: "putters" },
    { label: "Golf Bags", value: "golf_bags" },
    { label: "Golf Balls", value: "golf_balls" },
    { label: "Accessories", value: "golf_accessories" },
  ],

  baseball: [
    { label: "Bats", value: "baseball_bats" },
    { label: "Gloves", value: "baseball_gloves" },
    { label: "Cleats", value: "baseball_cleats" },
    { label: "Helmets", value: "baseball_helmets" },
    { label: "Accessories", value: "baseball_accessories" },
  ],

  softball: [
    { label: "Bats", value: "softball_bats" },
    { label: "Gloves", value: "softball_gloves" },
    { label: "Cleats", value: "softball_cleats" },
    { label: "Helmets", value: "softball_helmets" },
    { label: "Accessories", value: "softball_accessories" },
  ],

  basketball: [
    { label: "Basketballs", value: "basketballs" },
    { label: "Shoes", value: "basketball_shoes" },
    { label: "Jerseys", value: "basketball_jerseys" },
    { label: "Accessories", value: "basketball_accessories" },
  ],

  football: [
    { label: "Helmets", value: "football_helmets" },
    { label: "Pads", value: "football_pads" },
    { label: "Cleats", value: "football_cleats" },
    { label: "Accessories", value: "football_accessories" },
  ],

  soccer: [
    { label: "Cleats", value: "soccer_cleats" },
    { label: "Balls", value: "soccer_balls" },
    { label: "Shin Guards", value: "shin_guards" },
    { label: "Accessories", value: "soccer_accessories" },
  ],

  hockey: [
    { label: "Sticks", value: "hockey_sticks" },
    { label: "Skates", value: "hockey_skates" },
    { label: "Helmets", value: "hockey_helmets" },
    { label: "Pads", value: "hockey_pads" },
    { label: "Accessories", value: "hockey_accessories" },
  ],

  tennis: [
    { label: "Rackets", value: "tennis_rackets" },
    { label: "Balls", value: "tennis_balls" },
    { label: "Shoes", value: "tennis_shoes" },
    { label: "Accessories", value: "tennis_accessories" },
  ],

  boxing_mma: [
    { label: "Gloves", value: "boxing_gloves" },
    { label: "Hand Wraps", value: "hand_wraps" },
    { label: "Punching Bags", value: "punching_bags" },
    { label: "Accessories", value: "boxing_accessories" },
  ],

  skateboarding: [
    { label: "Decks", value: "decks" },
    { label: "Trucks", value: "trucks" },
    { label: "Wheels", value: "wheels" },
    { label: "Complete Boards", value: "complete_boards" },
    { label: "Accessories", value: "skate_accessories" },
  ],

  esports: [
    { label: "Controllers", value: "controllers" },
    { label: "Keyboards", value: "keyboards" },
    { label: "Mice", value: "mice" },
    { label: "Headsets", value: "headsets" },
    { label: "Accessories", value: "gaming_accessories" },
  ],

  sports_cards: [
    { label: "Graded Cards", value: "graded_cards" },
    { label: "Raw Cards", value: "raw_cards" },
    { label: "Sealed Boxes", value: "sealed_boxes" },
    { label: "Packs", value: "packs" },
    { label: "Supplies", value: "card_supplies" },
  ],

  cornhole: [
    { label: "Cornhole Bags", value: "cornhole_bags" },
    { label: "Boards", value: "cornhole_boards" },
    { label: "Board Sets", value: "cornhole_sets" },
    { label: "Jerseys", value: "cornhole_jerseys" },
    { label: "Accessories", value: "cornhole_accessories" },
  ],

  darts: [
    { label: "Steel Tip Darts", value: "steel_tip_darts" },
    { label: "Soft Tip Darts", value: "soft_tip_darts" },
    { label: "Dart Boards", value: "dart_boards" },
    { label: "Flights", value: "dart_flights" },
    { label: "Shafts", value: "dart_shafts" },
    { label: "Cases", value: "dart_cases" },
  ],

  disc_golf: [
    { label: "Drivers", value: "disc_drivers" },
    { label: "Midrange Discs", value: "midrange_discs" },
    { label: "Putters", value: "disc_putters" },
    { label: "Disc Bags", value: "disc_bags" },
    { label: "Accessories", value: "disc_accessories" },
  ],

  bowling: [
    { label: "Bowling Balls", value: "bowling_balls" },
    { label: "Bowling Bags", value: "bowling_bags" },
    { label: "Shoes", value: "bowling_shoes" },
    { label: "Accessories", value: "bowling_accessories" },
  ],
}

/* ---------------- SPORT → BRAND MAP ---------------- */

const SPORT_BRAND_MAP: Record<string, SelectorOption[]> = {

  billiards: [
    { label: "Precision", value: "precision" },
    { label: "Predator", value: "predator" },
    { label: "Cuetec", value: "cuetec" },
    { label: "McDermott", value: "mcdermott" },
    { label: "Meucci", value: "meucci" },
    { label: "Pechauer", value: "pechauer" },
    { label: "Jacoby", value: "jacoby" },
    { label: "Lucasi", value: "lucasi" },
    { label: "Mezz", value: "mezz" },
    { label: "Schon", value: "schon" },
    { label: "Viking", value: "viking" },
    { label: "Other", value: "other" },
  ],

  golf: [
    { label: "Titleist", value: "titleist" },
    { label: "Callaway", value: "callaway" },
    { label: "TaylorMade", value: "taylormade" },
    { label: "Ping", value: "ping" },
    { label: "Cobra", value: "cobra" },
    { label: "Other", value: "other" },
  ],

  baseball: [
    { label: "Easton", value: "easton" },
    { label: "Rawlings", value: "rawlings" },
    { label: "Louisville Slugger", value: "louisville_slugger" },
    { label: "Wilson", value: "wilson" },
    { label: "Marucci", value: "marucci" },
    { label: "Victus", value: "victus" },
    { label: "Other", value: "other" },
  ],

  softball: [
    { label: "Easton", value: "easton" },
    { label: "Rawlings", value: "rawlings" },
    { label: "Louisville Slugger", value: "louisville_slugger" },
    { label: "Wilson", value: "wilson" },
    { label: "DeMarini", value: "demarini" },
    { label: "Worth", value: "worth" },
    { label: "Other", value: "other" },
  ],

  basketball: [
    { label: "Nike", value: "nike" },
    { label: "Adidas", value: "adidas" },
    { label: "Jordan", value: "jordan" },
    { label: "Under Armour", value: "under_armour" },
    { label: "Wilson", value: "wilson" },
    { label: "Spalding", value: "spalding" },
    { label: "Molten", value: "molten" },
    { label: "Other", value: "other" },
  ],

  football: [
    { label: "Nike", value: "nike" },
    { label: "Adidas", value: "adidas" },
    { label: "Under Armour", value: "under_armour" },
    { label: "Riddell", value: "riddell" },
    { label: "Schutt", value: "schutt" },
    { label: "Wilson", value: "wilson" },
    { label: "Xenith", value: "xenith" },
    { label: "Other", value: "other" },
  ],

  soccer: [
    { label: "Nike", value: "nike" },
    { label: "Adidas", value: "adidas" },
    { label: "Puma", value: "puma" },
    { label: "Umbro", value: "umbro" },
    { label: "New Balance", value: "new_balance" },
    { label: "Mizuno", value: "mizuno" },
    { label: "Other", value: "other" },
  ],

  cornhole: [
    { label: "AllCornhole", value: "allcornhole" },
    { label: "BG Bags", value: "bg_bags" },
    { label: "Reynolds Bags", value: "reynolds_bags" },
    { label: "Ultra Bags", value: "ultra_bags" },
    { label: "Other", value: "other" },
  ],

  darts: [
    { label: "Winmau", value: "winmau" },
    { label: "Target", value: "target" },
    { label: "Harrows", value: "harrows" },
    { label: "Red Dragon", value: "red_dragon" },
    { label: "Other", value: "other" },
  ],

  disc_golf: [
    { label: "Innova", value: "innova" },
    { label: "Discraft", value: "discraft" },
    { label: "Dynamic Discs", value: "dynamic_discs" },
    { label: "MVP", value: "mvp" },
    { label: "Latitude 64", value: "latitude_64" },
    { label: "Other", value: "other" },
  ],

  bowling: [
    { label: "Storm", value: "storm" },
    { label: "Brunswick", value: "brunswick" },
    { label: "Hammer", value: "hammer" },
    { label: "Ebonite", value: "ebonite" },
    { label: "Motiv", value: "motiv" },
    { label: "Other", value: "other" },
  ],
}

/* ---------------- CONDITIONS ---------------- */

const CONDITIONS: SelectorOption[] = [
  { label: "New", value: "new", subtext: "Brand new, unused, and in original condition." },
  { label: "Like New", value: "like_new", subtext: "Very lightly used with little to no visible wear." },
  { label: "Good", value: "good", subtext: "Used but well maintained. Minor cosmetic wear only." },
  { label: "Fair", value: "fair", subtext: "Noticeable wear, scratches, or cosmetic flaws." },
  { label: "Poor", value: "poor", subtext: "Heavy wear, damage, or needs repair." },
]

/* ---------------- MAIN SCREEN ---------------- */

export default function EditListingScreen() {

  const { session } = useAuth()
  const router = useRouter()
  const params = useLocalSearchParams()
const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [loadingListing, setLoadingListing] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
const [sportType, setSportType] = useState<string>("")
const [category, setCategory] = useState<string>("")
const [brand, setBrand] = useState<string>("")
const [condition, setCondition] = useState<string>("")

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [showConditionModal, setShowConditionModal] = useState(false)
  const [showSportModal, setShowSportModal] = useState(false)

  const [isBoosted, setIsBoosted] = useState(false)
  const [isMegaBoosted, setIsMegaBoosted] = useState(false)
  const [originalBoosted, setOriginalBoosted] = useState(false)
const [originalMegaBoosted, setOriginalMegaBoosted] = useState(false)

  const [quantity, setQuantity] = useState("1")

const [isPro, setIsPro] = useState(false)
  const [boostsRemaining, setBoostsRemaining] = useState(0)
  const [megaBoostsRemaining, setMegaBoostsRemaining] = useState(0)

  const [shippingType, setShippingType] =
    useState<"seller_pays" | "buyer_pays" | null>(null)

  const [shippingPrice, setShippingPrice] = useState("")

  const [price, setPrice] = useState("")
  const [allowOffers, setAllowOffers] = useState(false)
  const [minOffer, setMinOffer] = useState("")

  const [checkingAddress, setCheckingAddress] = useState(true)
  const [hasReturnAddress, setHasReturnAddress] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const categoriesForSport =
    sportType && SPORT_CATEGORY_MAP[sportType]
      ? SPORT_CATEGORY_MAP[sportType]
      : []

  const brandsForSport =
    sportType && SPORT_BRAND_MAP[sportType]
      ? SPORT_BRAND_MAP[sportType]
      : []

 /* ---------------- LOAD LISTING ---------------- */

useEffect(() => {
  if (id) loadListing()
}, [id])

useEffect(() => {
  const loadGuards = async () => {
    if (!session?.user) {
      setCheckingAddress(false)
      return
    }

    try {
      setCheckingAddress(true)

      // ✅ MATCH CREATE LISTING (FIX)
      const { data: addressData } = await supabase
        .from("seller_return_addresses")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle()

      setHasReturnAddress(!!addressData)
      setShowAddressModal(!addressData)

      const { data: profile } = await supabase
  .from("profiles")
  .select("is_pro, boosts_remaining, mega_boosts_remaining")
  .eq("id", session.user.id)
  .single()

setIsPro(Boolean(profile?.is_pro))
setBoostsRemaining(profile?.boosts_remaining ?? 0)
setMegaBoostsRemaining(profile?.mega_boosts_remaining ?? 0)

    } catch (err) {
      console.log("Edit guard error:", err)

      // fallback (prevents blank screen)
      setHasReturnAddress(false)
      setShowAddressModal(true)
      setBoostsRemaining(0)
      setMegaBoostsRemaining(0)

    } finally {
      setCheckingAddress(false)
    }
  }

  loadGuards()
}, [session?.user?.id])

const loadListing = async () => {
  try {
    setLoadingListing(true)

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) throw error

    setTitle(data.title ?? "")
    setDescription(data.description ?? "")
    setSportType(data.sport_type ?? "")
    setBrand(data.brand ?? "")
    setCategory(data.category ?? "")
    setCondition(data.condition ?? "")

    setPrice(data.price ? String(data.price) : "")
    setAllowOffers(!!data.allow_offers)
    setMinOffer(data.min_offer ? String(data.min_offer) : "")

    setShippingType(data.shipping_type ?? null)
    setShippingPrice(data.shipping_price ? String(data.shipping_price) : "")

    setImages(data.image_urls ?? [])

    setIsBoosted(Boolean(data.is_boosted))
    setIsMegaBoosted(Boolean(data.is_mega_boost))
    setOriginalBoosted(Boolean(data.is_boosted))  
setOriginalMegaBoosted(Boolean(data.is_mega_boost))

    const safeLoadedQty =
      data.quantity && data.quantity > 0 ? data.quantity : 1

    setQuantity(String(safeLoadedQty))

  } catch (err) {
    handleAppError(err, {
      fallbackMessage: "Failed to load listing.",
    })

    router.back()

  } finally {
    setLoadingListing(false)
  }
}

/* ---------------- UPDATE LISTING ---------------- */

const handleUpdateListing = async () => {
  if (!session?.user || !id || submitting) return

  try {
    setSubmitting(true)

    const parsedPrice = parseFloat(price)
    const parsedMinOffer = minOffer ? parseFloat(minOffer) : null
    const parsedShippingPrice = shippingPrice ? parseFloat(shippingPrice) : 0

    const rawQty = parseInt(quantity, 10)
  const safeQuantity = Math.max(1, Number.isFinite(rawQty) ? rawQty : 1)

    if (isNaN(parsedPrice)) {
      Alert.alert("Invalid Price", "Please enter a valid price.")
      return
    }

    const uploadedImageUrls: string[] = []

    for (const uri of images) {
      if (uri.startsWith("http")) {
        uploadedImageUrls.push(uri)
        continue
      }

      const response = await fetch(uri)
      const arrayBuffer = await response.arrayBuffer()

      const fileExtMatch = uri.match(/\.(\w+)$/)
      const fileExt = fileExtMatch ? fileExtMatch[1] : "jpg"

      const fileName = `${session.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(fileName)

      uploadedImageUrls.push(data.publicUrl)
    }

    const updatePayload: any = {
  title: title.trim(),
  description: description.trim() || null,
  sport_type: sportType,
  brand,
  category,
  condition,
  price: parsedPrice,
  allow_offers: allowOffers,
  min_offer: allowOffers ? parsedMinOffer : null,
  shipping_type: shippingType,
  shipping_price: parsedShippingPrice,
  image_urls: uploadedImageUrls,
  quantity: safeQuantity,
  quantity_available: safeQuantity,

  // 🔥 LOCK BOOST IF EDITED
  boost_locked: isBoosted || isMegaBoosted ? false : true,
}

    const { error } = await supabase
      .from("listings")
      .update(updatePayload)
      .eq("id", id)

    if (error) throw error

    if (id) {
  try {
    if (originalBoosted || originalMegaBoosted) {
  console.log("Already boosted — skipping")
} else if (isMegaBoosted) {
  const { error: megaError } = await supabase.rpc("mega_boost_listing", {
    listing_id: id,
    user_id: session.user.id,
  })

  if (megaError) {
    console.warn("Mega Boost failed:", megaError.message)
  }
} else if (isBoosted) {
  const { error: boostError } = await supabase.rpc("boost_listing", {
    listing_id: id,
    user_id: session.user.id,
  })

  if (boostError) {
    console.warn("Boost failed:", boostError.message)
  }
}
  } catch (err) {
    console.warn("Boost RPC error:", err)
  }
}

Alert.alert("Success", "Listing updated successfully!")
router.back()

  } catch (err) {
    handleAppError(err, {
      context: "update_listing",
      fallbackMessage: "Failed to update listing.",
    })

  } finally {
    setSubmitting(false)
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#e8e8e8" },

  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },

  sectionSpacing: {
    marginTop: 18,
  },

  /* 🔥 BOOST SECTION */

  boostSectionWrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
  },

  boostHeader: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
  },

  boostCounterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  boostCounter: {
    fontSize: 13,
    fontWeight: "800",
    color: "#7FAF9B",
  },

  boostSub: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },

  boostRow: {
    flexDirection: "row",
    gap: 10,
  },

  boostOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  boostOptionActive: {
    borderColor: "#7FAF9B",
    backgroundColor: "#EAF4EF",
  },

  boostOptionTitle: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  boostOptionDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },

  boostLink: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#7FAF9B",
    textAlign: "center",
  },
})

/* ---------------- LOADING ---------------- */

if (checkingAddress || loadingListing) {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Edit Listing"
        onBack={() => router.back()} // ✅ THIS IS THE FIX
      />
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#7FAF9B" />
      </View>
    </View>
  )
}

const showAlreadyBoosted = () => {
  Alert.alert(
    "Already Boosted",
    "This listing is already boosted. Please wait until the boost period ends to boost again."
  )
}

/* ---------------- UI ---------------- */

return (
  <View style={styles.screen}>
    <AppHeader
  title="Edit Listing"
  onBack={() => router.back()}
/>

    <ScrollView contentContainerStyle={styles.content}>
      <ImageUpload images={images} setImages={setImages} max={5} />

      <TitleDescriptionSection
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <CategoryBrandConditionSection
        sportType={sportType}
        category={category}
        brand={brand}
        condition={condition}
        conditionSubtext={
          CONDITIONS.find(c => c.value === condition)?.subtext
        }
        onPressSportType={() => setShowSportModal(true)}
        onPressCategory={() => setShowCategoryModal(true)}
        onPressBrand={() => setShowBrandModal(true)}
        onPressCondition={() => setShowConditionModal(true)}
      />

      {/* 🔥 BOOST SECTION (UPDATED) */}
      <View style={styles.sectionSpacing}>
        <View style={styles.boostSectionWrap}>

          <Text style={styles.boostHeader}>Boost Your Listing</Text>

          <View style={styles.boostCounterRow}>
            <Text style={styles.boostCounter}>
              ⚡ {boostsRemaining} Boosts
            </Text>
            <Text style={styles.boostCounter}>
              🔥 {megaBoostsRemaining} Mega
            </Text>
          </View>

          <Text style={styles.boostSub}>
            Boost your listing to get more views and sell faster.
          </Text>

          <View style={styles.boostRow}>
            <TouchableOpacity
              style={[
                styles.boostOption,
                isBoosted && styles.boostOptionActive,
              ]}
              onPress={() => {
  if (originalBoosted || originalMegaBoosted) {
    showAlreadyBoosted()
    return
  }

  setIsBoosted(true)
  setIsMegaBoosted(false)
}}
              activeOpacity={0.9}
            >
              <Text style={styles.boostOptionTitle}>Boost</Text>
              <Text style={styles.boostOptionDesc}>
                Top placement for 7 days
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.boostOption,
                isMegaBoosted && styles.boostOptionActive,
              ]}
             onPress={() => {
  if (originalBoosted || originalMegaBoosted) {
    showAlreadyBoosted()
    return
  }

  setIsMegaBoosted(true)
  setIsBoosted(false)
}}
              activeOpacity={0.9}
            >
              <Text style={styles.boostOptionTitle}>Mega Boost</Text>
              <Text style={styles.boostOptionDesc}>
                Full spotlight for 14 days
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/pro/packages")}
            activeOpacity={0.8}
          >
            <Text style={styles.boostLink}>
              🚀 Need more boosts? Get them →
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {isPro && (
  <View style={styles.sectionSpacing}>
    <Quantity quantity={quantity} setQuantity={setQuantity} />
  </View>
)}

      <View style={styles.sectionSpacing}>
        <ShippingSection
          shippingType={shippingType}
          setShippingType={setShippingType}
          shippingPrice={shippingPrice}
          setShippingPrice={setShippingPrice}
        />
      </View>

      <View style={styles.sectionSpacing}>
        <PriceOffersSection
          price={price}
          setPrice={setPrice}
          allowOffers={allowOffers}
          setAllowOffers={setAllowOffers}
          minOffer={minOffer}
          setMinOffer={setMinOffer}
        />
      </View>

      <View style={styles.sectionSpacing}>
        <CreateListingFooter
          submitting={submitting}
          onSubmit={handleUpdateListing}
          label="Update Listing"
          disabled={
            submitting ||
            !title ||
            !sportType ||
            !category ||
            !condition ||
            !price ||
            images.length === 0 ||
            (allowOffers && !minOffer) ||
            !shippingType
          }
        />
      </View>
    </ScrollView>

    {/* ---------------- SELECTORS ---------------- */}

    <FullScreenSelector
      visible={showSportModal}
      title="Select Sport"
      options={SPORT_TYPES}
      selectedValue={sportType ?? undefined}
      onSelect={(value) => {
        setSportType(value)
        setShowSportModal(false)
      }}
      onClose={() => setShowSportModal(false)}
    />

    <FullScreenSelector
      visible={showCategoryModal}
      title="Select Category"
      options={categoriesForSport}
      selectedValue={category ?? undefined}
      onSelect={(value) => {
        setCategory(value)
        setShowCategoryModal(false)
      }}
      onClose={() => setShowCategoryModal(false)}
    />

    <FullScreenSelector
      visible={showBrandModal}
      title="Select Brand"
      options={brandsForSport}
      selectedValue={brand ?? undefined}
      onSelect={(value) => {
        setBrand(value)
        setShowBrandModal(false)
      }}
      onClose={() => setShowBrandModal(false)}
    />

    <FullScreenSelector
      visible={showConditionModal}
      title="Select Condition"
      options={CONDITIONS}
      selectedValue={condition ?? undefined}
      onSelect={(value) => {
        setCondition(value)
        setShowConditionModal(false)
      }}
      onClose={() => setShowConditionModal(false)}
    />

    <ReturnAddressRequiredModal
      visible={showAddressModal}
      onClose={() => setShowAddressModal(false)}
    />

  </View>
)
}