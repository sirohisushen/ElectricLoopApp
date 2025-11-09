import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import palette from "../theme/palette";
import { saveListing } from "../utils/storage";

const MISTRAL_API_KEY = "NYto91CcHm6Toc69a2QNXbBUdUOEjPnv"; 

const initialForm = {
  title: "",
  price: "",
  category: "",
  condition: "",
  description: "",
  image: null,
};

const AddListingScreen = ({ onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

 
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
  };

  // === CALL MISTRAL API ===
  const getMistralRating = async (data) => {
    const prompt = `
You are an expert in e-waste marketplace listings. Rate this listing out of 5 and give concise feedback.

Title: ${data.title}
Price: $${data.price}
Category: ${data.category}
Condition: ${data.condition}
Description: ${data.description}
Has photo: ${data.image ? "Yes" : "No"}

Return **only** JSON in this exact format:
{
  "rating": 4.2,
  "feedback": "Great detail. Add serial number and box for 5 stars."
}
`;

    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      const json = await res.json();
      const content = json.choices[0].message.content.trim();

      // Parse JSON from response
      const match = content.match(/\{.*\}/s);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error("Invalid response");
    } catch (err) {
      console.warn("Mistral failed, using fallback", err);
      // Fallback heuristic
      let score = 0;
      if (data.title.length > 10) score += 1.2;
      if (data.price > 0) score += 1;
      if (data.category) score += 0.6;
      if (data.condition) score += 0.6;
      if (data.description.length > 80) score += 1.2;
      if (data.image) score += 0.8;
      const rating = Math.min(5, Math.max(1, Number((score).toFixed(1))));
      return {
        rating,
        feedback: rating < 3 ? "Add more details and a photo." : "Good to go!",
      };
    }
  };

  const handlePost = async () => {
    if (!form.title.trim() || !form.price.trim()) {
      Alert.alert("Required", "Title and price are required.");
      return;
    }

    setIsSubmitting(true);

    const submission = {
      ...form,
      price: Number(form.price) || 0,
      badge: form.condition || "New",
      createdAt: new Date().toISOString(),
    };

    const aiReview = await getMistralRating(submission);

    setIsSubmitting(false);

    Alert.alert(
      `AI Review: ${aiReview.rating}/5`,
      aiReview.feedback,
      [
        {
          text: "Publish",
          onPress: async () => {
            try {
              await saveListing(submission);
              onSubmit?.(submission);
              setForm(initialForm);
              Alert.alert("Success", "Listing published!");
            } catch (error) {
              Alert.alert("Error", "Failed to save listing. Please try again.");
            }
          },
        },
        { text: "Edit", style: "cancel" },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>New Listing</Text>
        <Icon name="inventory-2" size={28} color={palette.accent} />
      </View>

      <View style={styles.card}>
        {/* Image */}
        <Text style={styles.label}>Photo</Text>
        {form.image ? (
          <View style={styles.imagePreview}>
            <Image source={{ uri: form.image }} style={styles.image} />
            <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <Icon name="add-a-photo" size={28} color={palette.accent} />
            <Text style={styles.uploadText}>Add Photo</Text>
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="MacBook Pro 14″ M1 Pro"
          value={form.title}
          onChangeText={(v) => handleChange("title", v)}
        />

        {/* Price */}
        <Text style={styles.label}>Price (₹)</Text>
        <View style={styles.row}>
          <Text style={styles.currency}>₹</Text>
          <TextInput
            style={styles.inputPrice}
            placeholder="950"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(v) => handleChange("price", v.replace(/[^0-9]/g, ""))}
          />
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Laptops"
          value={form.category}
          onChangeText={(v) => handleChange("category", v)}
        />

        {/* Condition */}
        <Text style={styles.label}>Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="Grade A, minor scuffs"
          value={form.condition}
          onChangeText={(v) => handleChange("condition", v)}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Include specs, accessories, warranty..."
          value={form.description}
          onChangeText={(v) => handleChange("description", v)}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
        onPress={handlePost}
        disabled={isSubmitting}
      >
        <Icon name="send" size={20} color="#fff" />
        <Text style={styles.submitText}>
          {isSubmitting ? "Analyzing..." : "Publish"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop:40,
    backgroundColor: "#fafafa",
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fdfdfd",
  },
  inputPrice: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fdfdfd",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.textPrimary,
    paddingHorizontal: 10,
  },
  textarea: {
    minHeight: 100,
    paddingTop: 12,
  },
  uploadBox: {
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.accent + "40",
    borderStyle: "dashed",
    backgroundColor: "#f8faff",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  uploadText: {
    fontSize: 13,
    color: palette.accent,
    fontWeight: "600",
  },
  imagePreview: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff3b30",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: palette.accent,
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: palette.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AddListingScreen;