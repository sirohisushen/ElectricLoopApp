import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { supabase } from "../lib/supabase";
import palette from "../theme/palette";

const AuthScreen = ({ onBack, onLoginSuccess, onSignupSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'

  const handleSignUp = async () => {
    setMessage("Creating your account...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("");
    if (onSignupSuccess) onSignupSuccess(email);
  };

  const handleSignIn = async () => {
    setMessage("Signing you in...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("");
    if (onLoginSuccess && data?.user) onLoginSuccess({ email: data.user.email, id: data.user.id });
  };

  const handleSignOut = async () => {
    setMessage("Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed out.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.brandSection}>
          <View style={styles.logoIcon} />
          <Text style={styles.brandMark}>ElectricLoop</Text>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            onPress={() => setMode("login")}
            style={[styles.segment, mode === "login" && styles.segmentActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, mode === "login" && styles.segmentTextActive]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode("signup")}
            style={[styles.segment, mode === "signup" && styles.segmentActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, mode === "signup" && styles.segmentTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headingSection}>
          <Text style={styles.title}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </Text>
          <Text style={styles.subtitle}>
            {mode === "signup"
              ? "Join thousands buying and selling quality electronics"
              : "Sign in to access your marketplace account"}
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {mode === "login" ? (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSignIn}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSignUp}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}

          {!!message && (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footerText}>
          {mode === "signup" 
            ? "By signing up, you agree to our Terms and Privacy Policy" 
            : "Forgot your password? Contact support"}
        </Text>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: palette.accent,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textSecondary,
    letterSpacing: -0.2,
  },
  segmentTextActive: {
    color: "#FFFFFF",
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
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
  messageContainer: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  message: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  footerText: {
    fontSize: 13,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
    paddingHorizontal: 20,
  },
});
export default AuthScreen;