import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import palette from "./src/theme/palette";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [pendingEmail, setPendingEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <SafeAreaView style={styles.appShell}>
      <StatusBar style="dark" />
      {currentScreen === "welcome" && (
        <WelcomeScreen onContinue={() => setCurrentScreen("auth")} />
      )}
      {currentScreen === "auth" && (
        <AuthScreen
          onBack={() => setCurrentScreen("welcome")}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentScreen("home");
          }}
          onSignupSuccess={(email) => {
            setPendingEmail(email);
            setCurrentScreen("profileSetup");
          }}
        />
      )}
      {currentScreen === "profileSetup" && (
        <ProfileSetupScreen
          email={pendingEmail}
          onBack={() => setCurrentScreen("auth")}
          onComplete={(profile) => {
            setCurrentUser(profile);
            setCurrentScreen("home");
          }}
        />
      )}
      {currentScreen === "home" && (
        <HomeScreen
          user={currentUser}
          onSignOut={async () => {
            try {
              // try to sign out if session exists; ignore errors for simplicity
              await (await import("./src/lib/supabase")).supabase.auth.signOut();
            } catch {}
            setCurrentUser(null);
            setPendingEmail("");
            setCurrentScreen("auth");
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: palette.background,
  },
});

