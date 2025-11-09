import AsyncStorage from "@react-native-async-storage/async-storage";

const LISTINGS_KEY = "@electricloop_listings";

export const saveListing = async (listing) => {
  try {
    const existing = await getListings();
    const newListing = {
      ...listing,
      id: listing.id || `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: listing.createdAt || new Date().toISOString(),
    };
    const updated = [newListing, ...existing];
    await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(updated));
    return newListing;
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
};

export const getListings = async () => {
  try {
    const data = await AsyncStorage.getItem(LISTINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting listings:", error);
    return [];
  }
};

export const deleteListing = async (id) => {
  try {
    const existing = await getListings();
    const updated = existing.filter((item) => item.id !== id);
    await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

