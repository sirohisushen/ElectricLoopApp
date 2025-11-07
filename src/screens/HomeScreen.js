import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { supabase } from "../lib/supabase";
import palette from "../theme/palette";

import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

// === UPDATED: Added category to sample items ===
const sampleItems = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: [
    "iPhone 12",
    "Galaxy S21",
    "ThinkPad X1",
    "PS4 Controller",
    "Nikon D3500",
    "AirPods Gen 2",
    "MacBook Pro",
    "Sony WH-1000XM4",
    "Samsung SSD",
    "Router TP-Link",
    "USB-C Hub",
    "Logitech Mouse",
  ][i],
  price: [120, 340, 560, 45, 260, 80, 890, 280, 95, 75, 35, 55][i],
  badge: ["Good", "Like New", "Refurb", "Fair"][i % 4],
  category: categories[i % categories.length], // <-- assign category
}));

const categories = [
  "Audio",
  "Image",
  "Phones",
  "Laptops",
  "Parts",
  "Consoles",
  "Cameras",
  "Storage",
  "Networking",
  "Accessories",
];

const HomeScreen = ({ user, onSignOut }) => {
  const [email, setEmail] = useState(user?.email ?? "");
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedView, setExpandedView] = useState(false); // <-- new state

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
  }, [user]);

  // === Filter items based on selected category ===
  const filteredItems = selectedCategory
    ? sampleItems.filter((item) => item.category === selectedCategory)
    : sampleItems;

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

      {/* Categories - Now clearly visible */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            activeOpacity={0.7}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
          >
            <Text
              style=[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid Header */}
      <View style={styles.gridHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Trending Listings</Text>
          <Text style={styles.sectionSubtitle}>
            {selectedCategory
              ? `${selectedCategory} devices`
              : "Certified refurbished devices"}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpandedView(true)} // <-- open expanded view
        >
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid - Filtered */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.cardImagePlaceholder}>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.badge}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>${item.price}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>4.{(item.id % 9) + 1}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.navIconActive}>
            <Icon name="home" size={20} color={palette.accent} />
          </View>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.navIconContainer}>
            <Icon name="chat-bubble-outline" size={20} color={palette.textSecondary} />
          </View>
          <Text style={styles.navLabel}>AI Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Feather name="plus" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.navIconContainer}>
            <Icon name="person-outline" size={20} color={palette.textSecondary} />
          </View>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onSignOut}>
          <View style={styles.navIconContainer}>
            <Icon name="logout" size={20} color={palette.textSecondary} />
          </View>
          <Text style={styles.navLabel}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* === EXPANDED VIEW MODAL === */}
      <Modal visible={expandedView} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedCategory ? `${selectedCategory} Listings` : "All Listings"}
            </Text>
            <TouchableOpacity onPress={() => setExpandedView(false)}>
              <Icon name="close" size={28} color={palette.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.modalGridContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} activeOpacity={0.85}>
                <View style={styles.cardImagePlaceholder}>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.badge}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>${item.price}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStar}>★</Text>
                      <Text style={styles.ratingText}>4.{(item.id % 9) + 1}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

/* === UPDATED STYLES === */
const styles = StyleSheet.create({
  // ... (all previous styles remain unchanged)

  // === CATEGORY CHIPS - Now more visible ===
  categoryChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    minWidth: 90,
    alignItems: "center",
  },
  categoryChipActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  categoryText: {
    color: palette.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: -0.3,
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },

  // === MODAL STYLES ===
  modalContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  modalGridContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // ... rest of your original styles below
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
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
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
  },
  cardImagePlaceholder: {
    height: 140,
    backgroundColor: "#F3F4F6",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
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
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconActive: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${palette.accent}15`,
    borderRadius: 12,
  },
  navLabel: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: "600",
  },
  navLabelActive: {
    color: palette.accent,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: -30,
  },
});

export default HomeScreen;