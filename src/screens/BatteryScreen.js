import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"; // Added ScrollView
import Icon from "react-native-vector-icons/MaterialIcons";

import palette from "../theme/palette";

const BatteryScreen = ({ onRequestPickup }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent} // Ensures padding at bottom
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Icon name="battery-charging-full" size={32} color={palette.accent} />
        <Text style={styles.heroTitle}>Sell Your Batteries To ElectricLoop For Instant Cash</Text>
        <Text style={styles.heroSubtitle}>
          We buy batteries and process them to produce minerals.
        </Text>
      </View>

      <View style={styles.stepCard}>
        <View style={styles.stepRow}>
          <View style={styles.stepBullet}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Tell us what you have</Text>
            <Text style={styles.stepText}>Select battery chemistry, quantity, and current condition.</Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={styles.stepBullet}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Schedule a pickup</Text>
            <Text style={styles.stepText}>Choose a courier pickup or drop-off at a partner logistics hub.</Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={styles.stepBullet}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Instant payout</Text>
            <Text style={styles.stepText}>We verify condition on arrival and release payment within 24 hours.</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.8}
        onPress={onRequestPickup}
      >
        <Icon name="bolt" size={20} color="#FFFFFF" style={styles.ctaIcon} />
        <Text style={styles.ctaText}>Request Battery Pickup</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Accepted chemistries</Text>
        <Text style={styles.infoList}>
          • Lithium-ion (consumer electronics)
          {"\n"}• Nickel-metal hydride (power tools)
          {"\n"}• Lithium polymer (drones & wearables)
        </Text>
        <Text style={styles.infoCaption}>We do not accept damaged/swollen cells.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50, // Keeps content below status bar / safe area
    gap: 20,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepBullet: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(10, 132, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(10, 132, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: palette.accent,
    fontWeight: "700",
  },
  stepCopy: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  stepText: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accent,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaIcon: {
    marginTop: -2,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  infoList: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  infoCaption: {
    fontSize: 12,
    color: palette.textSecondary,
  },
});

export default BatteryScreen; 