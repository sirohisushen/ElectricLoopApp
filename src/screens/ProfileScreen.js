import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { supabase } from "../lib/supabase";
import palette from "../theme/palette";

const ProfileScreen = ({ user, onEditProfile, onSignOut }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, city, country, interests")
        .eq("id", userId)
        .maybeSingle();
      if (!cancelled) {
        setProfile(data || null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const displayName = profile?.full_name || user?.fullName || user?.email || "Member";
  const location = [profile?.city || user?.city, profile?.country || user?.country]
    .filter(Boolean)
    .join(", ");
  const interests = profile?.interests || user?.interests || [];

  return (
    <View style={styles.container}>
      <View style={styles.avatarCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nameText}>{displayName}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
        {!!location && <Text style={styles.locationText}>{location}</Text>}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Marketplace preferences</Text>
          <TouchableOpacity onPress={onEditProfile} activeOpacity={0.7}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        {interests.length ? (
          <View style={styles.chipRow}>
            {interests.map((interest) => (
              <View key={interest} style={styles.chip}>
                <Text style={styles.chipText}>{interest}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.placeholder}>No interests yet. Add a few to tailor your feed.</Text>
        )}
      </View>

      <View style={styles.metricsCard}>
        <View style={styles.metricColumn}>
          <Text style={styles.metricValue}>12</Text>
          <Text style={styles.metricLabel}>Listings</Text>
        </View>
        <View style={styles.metricColumn}>
          <Text style={styles.metricValue}>4.9</Text>
          <Text style={styles.metricLabel}>Avg. rating</Text>
        </View>
        <View style={styles.metricColumn}>
          <Text style={styles.metricValue}>8</Text>
          <Text style={styles.metricLabel}>Deals closed</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.8} onPress={onSignOut}>
        <Icon name="logout" size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    padding: 24,
    gap: 20,
  },
  avatarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(10,132,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: palette.accent,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  emailText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  locationText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  editLink: {
    color: palette.accent,
    fontWeight: "600",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    color: palette.accent,
    fontWeight: "600",
  },
  placeholder: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  metricsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  metricColumn: {
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: palette.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  signOutButton: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.accent,
    borderRadius: 16,
    paddingVertical: 16,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProfileScreen;

