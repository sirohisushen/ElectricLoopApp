import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import palette from "../theme/palette";

const ListingDetailScreen = ({ listing, onBack, user }) => {
  const [quantity, setQuantity] = useState("1");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleOrder = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert("Address required", "Please enter your delivery address.");
      return;
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    Alert.alert(
      "Order Confirmed",
      `Your order for ${quantity}x ${listing.title} has been placed!\n\nEstimated delivery: ${estimatedDelivery.toLocaleDateString()}\nTotal: ₹${(listing.price || 0) * Number(quantity)}`,
      [{ text: "OK", onPress: onBack }]
    );
  };

  const sellerReviews = [
    { id: 1, name: "M. Salah", rating: 5, comment: "Fast shipping, item as described!", date: "2 days ago" },
    { id: 2, name: "C. Ronaldo", rating: 4, comment: "Good condition, minor delay in shipping.", date: "1 week ago" },
    { id: 3, name: "Raphinha", rating: 5, comment: "Excellent seller, highly recommend!", date: "2 weeks ago" },
  ];

  const avgRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        {listing.image ? (
          <Image source={{ uri: listing.image }} style={styles.mainImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={48} color={palette.textSecondary} />
          </View>
        )}

        {/* Badge */}
        {listing.badge && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{listing.badge}</Text>
            </View>
          </View>
        )}

        {/* Title & Price */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>
            {listing.price ? `₹${listing.price}` : "Price on request"}
          </Text>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerCard}>
          <View style={styles.sellerHeader}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "S"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {user?.fullName || user?.email || "Verified Seller"}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingValue}>{avgRating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({sellerReviews.length} reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          {listing.category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{listing.category}</Text>
            </View>
          )}
          {listing.condition && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Condition:</Text>
              <Text style={styles.detailValue}>{listing.condition}</Text>
            </View>
          )}
          {listing.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{listing.description}</Text>
            </View>
          )}
        </View>

        {/* Reviews */}
        <View style={styles.reviewsCard}>
          <Text style={styles.sectionTitle}>Seller Reviews</Text>
          {sellerReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <View style={styles.reviewRating}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.reviewRatingValue}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        {/* Order Section */}
        <View style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Place Order</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.label}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))}
                style={styles.quantityButton}
              >
                <Icon name="remove" size={20} color={palette.accent} />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={(v) => setQuantity(v.replace(/[^0-9]/g, "") || "1")}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => setQuantity(String(Number(quantity) + 1))}
                style={styles.quantityButton}
              >
                <Icon name="add" size={20} color={palette.accent} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Delivery Address:</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="Enter your delivery address"
            placeholderTextColor="#9CA3AF"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
              ₹{(listing.price || 0) * Number(quantity)}
            </Text>
          </View>

          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Icon name="shopping-cart" size={22} color="#FFFFFF" />
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mainImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#F3F4F6",
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 20,
    left: 16,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  titleSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: palette.accent,
  },
  sellerCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(10,132,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sellerInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.accent,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingStar: {
    fontSize: 14,
    color: "#FFA726",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textSecondary,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: palette.textPrimary,
    flex: 1,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: palette.textPrimary,
    lineHeight: 20,
    marginTop: 4,
  },
  reviewsCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 8,
    gap: 16,
  },
  reviewItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewRatingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  reviewComment: {
    fontSize: 14,
    color: palette.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 8,
    gap: 16,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    width: 60,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingVertical: 8,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: palette.textPrimary,
    backgroundColor: "#FDFDFD",
    minHeight: 80,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.accent,
  },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.accent,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default ListingDetailScreen;

