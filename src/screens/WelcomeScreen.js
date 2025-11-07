import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import palette from "../theme/palette";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ onContinue }) => (
  <View style={styles.container}>
    <View style={styles.gradientOverlay} />
    
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon} />
          <Text style={styles.brandMark}>ElectricLoop</Text>
        </View>
        <Text style={styles.tagline}>Electronics Marketplace</Text>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroHeadline}>
          Built For{"\n"} Those Who Move Fast
        </Text>
        <Text style={styles.heroCopy}>
          AI-powered electronics marketplace built to help all companies find the best electronics.
        </Text>
      </View>

     

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>Enter Marketplace</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          Join thousands of satisfied buyers and sellers
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: palette.accent,
    opacity: 0.03,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: palette.accent,
    marginRight: 10,
  },
  brandMark: {
    fontSize: 28,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    fontWeight: "500",
    color: palette.textSecondary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  heroHeadline: {
    fontSize: 36,
    fontWeight: "700",
    color: palette.textPrimary,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 42,
    letterSpacing: -1,
  },
  heroCopy: {
    fontSize: 17,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 8,
    fontWeight: "400",
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  featureContent: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featureText: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
    marginBottom: 3,
    fontWeight: "400",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: palette.accent,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginRight: 8,
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 13,
    color: palette.textSecondary,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "400",
  },
});

export default WelcomeScreen;