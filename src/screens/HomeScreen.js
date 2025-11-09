import { useEffect, useState } from "react";
import {
  FlatList,
  Image,               // <-- NEW
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";
import palette from "../theme/palette";
import { getListings } from "../utils/storage";
import Icon from "react-native-vector-icons/MaterialIcons";

/* --------------------------------------------------------------
   Sample data – now each item has an optional `image` URL.
   Just replace the URL with your own asset / remote image.
   -------------------------------------------------------------- */
const sampleItems = [
  {
    id: "1",
    title: "iPhone Charger",
    price: 3000,
    badge: "Like New",
    category: "Charger",
    image:
      "https://i.ebayimg.com/images/g/6hYAAOSw4bxjhQfi/s-l1200.png",
  },
  {
    id: "2",
    title: "Gt710 Graphics Card",
    price: 3400,
    badge: "Certified",
    category: "GPUs",
    image:
      "https://i.ebayimg.com/images/g/vW8AAeSwVtZopSq5/s-l1200.jpg",
  },
  {
    id: "3",
    title: "XE1 Printer",
    price: 500,
    badge: "Refurb/Old",
    category: "Printer",
    image:
      "https://u-mercari-images.mercdn.net/photos/m68110366377_1.jpg",
  },
  {
    id: "4",
    title: "Nokia 3330",
    price: 1200,
    badge: "Refurb",
    category: "Phone",
    image:
      "https://i.redd.it/tf62glkctnb51.jpg",
  },
  {
    id: "5",
    title: "Dell Laptop Charger",
    price: 2500,
    badge: "Used",
    category: "Charger",
    image: "https://www.myorderstore.com/image/cache/catalog/Products/Products/lenovooriginalcable-550x550h.png.webp",
  },
  {
    id: "6",
    title: "HP OfficeJet 4500 Printer",
    price: 4500,
    badge: "Old/Refurb",
    category: "Printer",
    image: "https://i.ytimg.com/vi/P2SVsxK7v_Y/maxresdefault.jpg",
  },
  {
    id: "7",
    title: "Sony Walkman MP3 Player",
    price: 1800,
    badge: "Good",
    category: "Audio",
    image: "https://images-cdn.ubuy.co.in/634d115edcbffb70f4349d6b-sony-walkman-wm-ex102.jpg",
  },
  {
    id: "8",
    title: "Samsung 500GB Hard Drive",
    price: 2200,
    badge: "Used",
    category: "Storage",
    image: "https://www.lifewire.com/thmb/bl9K_09pPJBD_MFjsCZxAGTfReg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1223787492-dbb8cb439806406fb4f2d741ce643203.jpg",
  },
  {
    id: "9",
    title: "10 2gb RAM Sticks",
    price: 300,
    badge: "Used",
    category: "Accessories",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9yiku8ecyy7l25Y_Z43Q9UyWEL1R0OpUdbQ&s",
  },
  {
    id: "10",
    title: "1KG Old Electric Chips",
    price: 1000,
    badge: "Refurb",
    category: "E-Chips",
    image: "https://mtajtraders.com/wp-content/uploads/2023/01/ewaste-scaled.webp",
  },
  {
    id: "11",
    title: "15x Samsung Phones",
    price: 1000,
    badge: "Refurb/Old",
    category: "Phone",
    image: "https://i.ytimg.com/vi/DzMXJeVxkhQ/maxresdefault.jpg",
  },
  {
    id: "12",
    title: "15 720p Monitors",
    price: 1500,
    badge: "Certified",
    category: "Audio",
    image: "https://www.tvfilmprops.co.uk/userdata/PRODPIC-3899.jpg",
  },
];

const HomeScreen = ({ user, onItemPress }) => {
  const [email, setEmail] = useState(user?.email ?? "");
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState("");
  const [savedListings, setSavedListings] = useState([]);


  useEffect(() => {
    if (!email) {
      supabase.auth.getSession().then(({ data }) => {
        const e = data?.session?.user?.email;
        if (e) setEmail(e);
      });
    }
  }, [email]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (profile?.loaded) return;
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || user?.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, city, country, interests")
        .eq("id", userId)
        .maybeSingle();
      if (!cancelled) {
        if (!error && data) setProfile({ ...data, loaded: true });
        else setProfile({ loaded: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, profile?.loaded]);

  useEffect(() => {
    const loadListings = async () => {
      const saved = await getListings();
      setSavedListings(saved);
    };
    loadListings();
    const interval = setInterval(loadListings, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- Filtering ---------- */
  const savedIds = new Set(savedListings.map((item) => item.id));
  const uniqueSampleItems = sampleItems.filter((item) => !savedIds.has(item.id));
  const allItems = [...savedListings, ...uniqueSampleItems];
  const filteredItems = allItems.filter((item) => {
    const matchesQuery = query
      ? item.title.toLowerCase().includes(query.trim().toLowerCase())
      : true;
    return matchesQuery;
  });

  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{profile?.full_name || "Explorer"}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton} activeOpacity={0.7}>
            <Icon name="notifications" size={22} color={palette.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={18} color={palette.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search electronics..."
            placeholderTextColor="#A0A0A0"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Grid Header – directly under the search bar */}
      <View style={styles.gridHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Trending Listings</Text>
          <Text style={styles.sectionSubtitle}>Certified refurbished devices</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => onItemPress?.(item)}
          >
            {/* ---------- Image (with fallback) ---------- */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            ) : (
              <View style={styles.cardImagePlaceholder} />
            )}

            <View style={styles.cardBadgeContainer}>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.badge}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>
                  {item.price ? `₹${item.price}` : "Price on request"}
                </Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>
                    {item.rating ? item.rating.toFixed(1) : `4.${(Number(item.id?.replace(/\D/g, "") || 1) % 5) + 3}`}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

/* ====================== STYLES ====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  headerSection: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: palette.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.5,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
  },

  /* ---- Grid Header (no categories) ---- */
  gridHeaderRow: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: "500",
  },
  seeAll: {
    color: palette.accent,
    fontWeight: "600",
    fontSize: 15,
  },

  /* ---- Grid ---- */
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gridRow: {
    gap: 14,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    position: "relative",
  },

  /* Image */
  cardImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#F3F4F6",
  },

  /* Badge (now positioned absolutely over the image) */
  cardBadgeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  cardBadge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: palette.accent,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingStar: {
    fontSize: 14,
    color: "#FFA726",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.textSecondary,
  },

  /* Empty state */
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
  },
});

export default HomeScreen;