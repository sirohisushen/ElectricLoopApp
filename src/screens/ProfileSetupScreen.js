// ProfileSetupScreen.js
import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics"; 

import palette from "../theme/palette";
import { supabase } from "../lib/supabase";

const ELECTRONICS_CATEGORIES = [
  "Large Appliances",
  "Small Appliances",
  "IT & Telecom Equipment",
  "Consumer Electronics",
  "Lighting Equipment",
  "Electrical Tools",
  "Toys & Leisure Devices",
  "Medical Devices",
  "Monitoring Equipment",
  "Batteries & Accumulators",
  "Cables & Wires",
  "Circuit Boards & Components",
  "Mixed E-Waste"
];


const ProfileSetupScreen = ({ email, onComplete, onBack }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);


  const cityRef = useRef(null);
  const countryRef = useRef(null);

  
  const [errors, setErrors] = useState({
    fullName: "",
    city: "",
    country: "",
  });

  
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return ELECTRONICS_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return ELECTRONICS_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(q)
    );
  }, [searchQuery]);

 
  const toggleInterest = useCallback(
    (interest) => {
      if (Haptics) Haptics.selectionAsync().catch(() => {});
      setSelectedInterests((prev) =>
        prev.includes(interest)
          ? prev.filter((i) => i !== interest)
          : [...prev, interest]
      );
    },
    []
  );

  
  const validateField = useCallback((field, value) => {
    const isValid = value.trim().length >= 2;
    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? "" : `${field} must be at least 2 characters`,
    }));
    return isValid;
  }, []);

  const handleSubmit = useCallback(async () => {
    const nameOk = validateField("fullName", fullName);
    const cityOk = validateField("city", city);
    const countryOk = validateField("country", country);

    if (!nameOk || !cityOk || !countryOk) {
      Alert.alert("Oops", "Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (userId) {
        await supabase.from("profiles").upsert(
          {
            id: userId,
            full_name: fullName.trim() || null,
            city: city.trim() || null,
            country: country.trim() || null,
            interests: selectedInterests.length > 0 ? selectedInterests : null,
          },
          { onConflict: "id" }
        );
      }

      onComplete({
        email,
        fullName: fullName.trim(),
        city: city.trim(),
        country: country.trim(),
        interests: selectedInterests,
      });
    } catch (err) {
      console.error("Profile save error:", err);
      Alert.alert("Error", "Could not save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    fullName,
    city,
    country,
    selectedInterests,
    email,
    onComplete,
    validateField,
  ]);

  // Render category item
  const renderCategory = ({ item }) => {
    const checked = selectedInterests.includes(item);
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => toggleInterest(item)}
        activeOpacity={0.7}
        accessibilityLabel={`Toggle ${item}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.dropdownItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && { paddingHorizontal: 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoIcon} />
          <Text style={styles.brandMark}>ElectricLoop</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your marketplace experience
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Email */}
          <View style={styles.emailSection}>
            <Text style={styles.label}>Account Email</Text>
            <View style={styles.emailBadge}>
              <Text style={styles.emailValue}>{email}</Text>
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Enter your full name"
              placeholderTextColor="#A0A0A0"
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => validateField("fullName", fullName)}
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
              autoCapitalize="words"
              accessibilityLabel="Full name"
            />
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            ) : null}
          </View>

          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>City</Text>
              <TextInput
                ref={cityRef}
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="e.g. San Francisco"
                placeholderTextColor="#A0A0A0"
                value={city}
                onChangeText={setCity}
                onBlur={() => validateField("city", city)}
                returnKeyType="next"
                onSubmitEditing={() => countryRef.current?.focus()}
                autoCapitalize="words"
                accessibilityLabel="City"
              />
              {errors.city ? (
                <Text style={styles.errorText}>{errors.city}</Text>
              ) : null}
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                ref={countryRef}
                style={[styles.input, errors.country && styles.inputError]}
                placeholder="e.g. USA"
                placeholderTextColor="#A0A0A0"
                value={country}
                onChangeText={setCountry}
                onBlur={() => validateField("country", country)}
                returnKeyType="done"
                autoCapitalize="words"
                accessibilityLabel="Country"
              />
              {errors.country ? (
                <Text style={styles.errorText}>{errors.country}</Text>
              ) : null}
            </View>
          </View>

          {/* Interests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Interests</Text>
            <Text style={styles.helperText}>
              Select categories you’re interested in
            </Text>

            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setDropdownVisible(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text
                style={
                  selectedInterests.length
                    ? styles.dropdownTextActive
                    : styles.dropdownText
                }
              >
                {selectedInterests.length
                  ? `${selectedInterests.length} selected`
                  : "Select categories"}
              </Text>
              <Text style={styles.dropdownArrow}>Down Arrow</Text>
            </TouchableOpacity>

            {selectedInterests.length > 0 && (
              <View style={styles.selectedChips}>
                {selectedInterests.map((i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{i}</Text>
                    <TouchableOpacity
                      onPress={() => toggleInterest(i)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel={`Remove ${i}`}
                    >
                      <Text style={styles.chipRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

       
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isSubmitting && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.9}
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Continue to Marketplace
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          You can update your preferences anytime in settings
        </Text>
      </ScrollView>

      
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item}
            renderItem={renderCategory}
            style={styles.modalList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  backButtonText: { color: palette.textPrimary, fontSize: 15, fontWeight: "600" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
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
  brandMark: { fontSize: 24, fontWeight: "700", color: palette.textPrimary },
  headingSection: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "700", color: palette.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: palette.textSecondary, lineHeight: 24 },
  formCard: {
    backgroundColor: "#FFF",
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
  emailSection: { marginBottom: 20 },
  emailBadge: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10, 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  emailValue: { fontSize: 15, color: palette.textPrimary, fontWeight: "600" },
  inputGroup: { marginBottom: 20 },
  inputRow: { flexDirection: "row", gap: 12 },
  inputHalf: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: palette.textPrimary, marginBottom: 8 },
  helperText: { fontSize: 13, color: palette.textSecondary, marginBottom: 12, lineHeight: 18 },
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
  inputError: { borderColor: "#E74C3C" },
  errorText: { color: "#E74C3C", fontSize: 12, marginTop: 4, marginLeft: 4 },
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
  dropdownText: { fontSize: 16, color: "#A0A0A0" },
  dropdownTextActive: { fontSize: 16, color: palette.textPrimary, fontWeight: "600" },
  dropdownArrow: { fontSize: 12, color: palette.textSecondary },
  selectedChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.accent,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 13, color: "#FFF", fontWeight: "600", marginRight: 6 },
  chipRemove: { fontSize: 20, color: "#FFF", fontWeight: "600" },
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
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFF", fontSize: 17, fontWeight: "600" },
  footerText: { fontSize: 13, color: palette.textSecondary, textAlign: "center", lineHeight: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingTop: 12,
  },
  searchInput: {
    marginHorizontal: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  modalList: { maxHeight: 400 },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  checkboxChecked: { backgroundColor: palette.accent, borderColor: palette.accent },
  checkmark: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  dropdownItemText: { fontSize: 15, color: palette.textPrimary, fontWeight: "500" },
});

export default ProfileSetupScreen;