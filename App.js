import { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import BatteryScreen from "./src/screens/BatteryScreen";
import AddListingScreen from "./src/screens/AddListingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ListingDetailScreen from "./src/screens/ListingDetailScreen";
import palette from "./src/theme/palette";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [pendingEmail, setPendingEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);

  const handleSignOut = async () => {
    try {
      await (await import("./src/lib/supabase")).supabase.auth.signOut();
    } catch {}
    setCurrentUser(null);
    setPendingEmail("");
    setActiveTab("home");
    setCurrentScreen("auth");
  };

  const handleListingSubmit = () => {
    setActiveTab("home");
  };

  const handleBatteryPickup = () => {
    Alert.alert("Pickup requested", "Operations will reach out within 24 hours.");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "battery":
        return <BatteryScreen onRequestPickup={handleBatteryPickup} />;
      case "add":
        return <AddListingScreen onSubmit={handleListingSubmit} />;
      case "profile":
        return (
          <ProfileScreen
            user={currentUser}
            onEditProfile={() => {
              setPendingEmail(currentUser?.email ?? "");
              setCurrentScreen("profileSetup");
            }}
            onSignOut={handleSignOut}
          />
        );
      case "home":
      default:
        return (
          <HomeScreen
            user={currentUser}
            onItemPress={(item) => setSelectedListing(item)}
          />
        );
    }
  };

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => setActiveTab("home")}
      >
        <View style={[styles.navIcon, activeTab === "home" && styles.navIconActive]}>
          <Icon name="home" size={22} color={activeTab === "home" ? palette.accent : palette.textSecondary} />
        </View>
        <Text style={[styles.navLabel, activeTab === "home" && styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => setActiveTab("battery")}
      >
        <View style={[styles.navIcon, activeTab === "battery" && styles.navIconActive]}>
          <Icon
            name="battery-charging-full"
            size={22}
            color={activeTab === "battery" ? palette.accent : palette.textSecondary}
          />
        </View>
        <Text style={[styles.navLabel, activeTab === "battery" && styles.navLabelActive]}>Battery</Text>
      </TouchableOpacity>
  
  
      <TouchableOpacity
        style={[styles.addButton, activeTab === "add" && styles.addButtonActive]}
        activeOpacity={0.85}
        onPress={() => setActiveTab("add")}
      >
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
  
      
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => setActiveTab("profile")}
      >
        <View style={[styles.navIcon, activeTab === "profile" && styles.navIconActive]}>
          <Icon
            name="person-outline"
            size={22}
            color={activeTab === "profile" ? palette.accent : palette.textSecondary}
          />
        </View>
        <Text style={[styles.navLabel, activeTab === "profile" && styles.navLabelActive]}>Profile</Text>
      </TouchableOpacity>
  
      
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={handleSignOut}
      >
        <View style={[styles.navIcon, activeTab === "logout" && styles.navIconActive]}>
          <Icon
            name="logout"
            size={22}
            color={activeTab === "logout" ? palette.accent : palette.textSecondary}
          />
        </View>
        <Text style={[styles.navLabel, activeTab === "logout" && styles.navLabelActive]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

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
            setCurrentUser((prev) => ({ ...prev, ...user }));
            setActiveTab("home");
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
            setCurrentUser((prev) => ({ ...prev, ...profile }));
            setActiveTab("home");
            setCurrentScreen("home");
          }}
        />
      )}
      {currentScreen === "home" && (
        <>
          {selectedListing ? (
            <ListingDetailScreen
              listing={selectedListing}
              user={currentUser}
              onBack={() => setSelectedListing(null)}
            />
          ) : (
            <View style={styles.mainContainer}>
              <View style={styles.mainContent}>{renderActiveTab()}</View>
              {renderBottomNav()}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mainContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconActive: {
    backgroundColor: "rgba(10,132,255,0.12)",
  },
  navLabel: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: "600",
  },
  navLabelActive: {
    color: palette.accent,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -24,
  },
  addButtonActive: {
    transform: [{ scale: 0.96 }],
  },
});

