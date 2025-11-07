import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

import palette from "../theme/palette";
import { supabase } from "../lib/supabase";

const ELECTRONICS_CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Desktop PCs",
  "Computer Parts (GPUs, CPUs)",
  "Storage Devices",
  "Cameras",
  "Audio Equipment",
  "Smart Watches",
  "Gaming Consoles",
  "Monitors",
  "Networking Equipment",
  "Accessories",
  "Other Electronics"
];

const ProfileSetupScreen = ({ email, onComplete, onBack }) => {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (userId) {
        await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              full_name: fullName || null,
              city: city || null,
              country: country || null,
              interests: selectedInterests.length ? selectedInterests : null,
            },
            { onConflict: "id" }
          );
      }
    } catch {}
    onComplete({ email, fullName, city, country, interests: selectedInterests });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandSection}>
          <View style={styles.logoIcon} />
          <Text style={styles.brandMark}>ElectricLoop</Text>
        </View>

        <View style={styles.headingSection}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your marketplace experience
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.emailSection}>
            <Text style={styles.label}>Account Email</Text>
            <View style={styles.emailBadge}>
              <Text style={styles.emailValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#A0A0A0"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. San Francisco"
                placeholderTextColor="#A0A0A0"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. USA"
                placeholderTextColor="#A0A0A0"
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Interests</Text>
            <Text style={styles.helperText}>
              Select categories you're interested in buying or selling
            </Text>
            
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => setDropdownOpen(!dropdownOpen)}
              activeOpacity={0.7}
            >
              <Text style={selectedInterests.length > 0 ? styles.dropdownTextActive : styles.dropdownText}>
                {selectedInterests.length > 0 
                  ? `${selectedInterests.length} selected` 
                  : "Select categories"}
              </Text>
              <Text style={styles.dropdownArrow}>{dropdownOpen ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView 
                  style={styles.dropdownScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {ELECTRONICS_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.dropdownItem}
                      onPress={() => toggleInterest(category)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkbox,
                        selectedInterests.includes(category) && styles.checkboxChecked
                      ]}>
                        {selectedInterests.includes(category) && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.dropdownItemText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedInterests.length > 0 && (
              <View style={styles.selectedChips}>
                {selectedInterests.map((interest) => (
                  <View key={interest} style={styles.chip}>
                    <Text style={styles.chipText}>{interest}</Text>
                    <TouchableOpacity 
                      onPress={() => toggleInterest(interest)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.chipRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Continue to Marketplace</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          You can update your preferences anytime in settings
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  backButtonText: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: palette.accent,
    marginRight: 8,
  },
  brandMark: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.5,
  },
  headingSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    color: palette.textSecondary,
    lineHeight: 24,
    fontWeight: "400",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    marginBottom: 20,
  },
  emailSection: {
    marginBottom: 20,
  },
  emailBadge: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  emailValue: {
    fontSize: 15,
    color: palette.textPrimary,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  helperText: {
    fontSize: 13,
    color: palette.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  dropdownTrigger: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#A0A0A0",
  },
  dropdownTextActive: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: "600",
  },
  dropdownArrow: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    maxHeight: 280,
  },
  dropdownScroll: {
    maxHeight: 280,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  dropdownItemText: {
    fontSize: 15,
    color: palette.textPrimary,
    fontWeight: "500",
  },
  selectedChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.accent,
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
  },
  chipText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 6,
  },
  chipRemove: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600",
    paddingHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: palette.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  footerText: {
    fontSize: 13,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
  },
});

export default ProfileSetupScreen;