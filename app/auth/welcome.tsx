import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { View } from "@/components/Themed";
import { SpiritualText } from "@/components/atoms/SpiritualText";
import { SpiritualButton } from "@/components/atoms/SpiritualButton";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { signIn } = useAuth();

  const handleSignIn = () => {
    signIn();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Sacred Moon Symbol */}
      <View style={styles.moonContainer}>
        <SpiritualText variant="h1" align="center" style={styles.moonEmoji}>
          🌙
        </SpiritualText>
      </View>

      {/* App Branding */}
      <View style={styles.branding}>
        <SpiritualText variant="h1" align="center" style={styles.appName}>
          DreamJournal
        </SpiritualText>
        <SpiritualText variant="mantra" align="center" style={styles.tagline}>
          Capture the wisdom of your dreams
        </SpiritualText>
      </View>

      {/* Sacred Description */}
      <View style={styles.description}>
        <SpiritualText variant="body" align="center" style={styles.descText}>
          Welcome to your sacred space for dream exploration. Begin your journey into the mystical
          realm of consciousness.
        </SpiritualText>
      </View>

      {/* Sacred Actions */}
      <View style={styles.actions}>
        <SpiritualButton
          title="✨ Begin Your Journey"
          onPress={handleSignIn}
          variant="sacred"
          size="large"
          style={styles.primaryButton}
        />

        <SpiritualButton
          title="🔮 Sign In with Sacred Intent"
          onPress={handleSignIn}
          variant="ghost"
          size="medium"
          style={styles.ghostButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#121212",
  },
  moonContainer: {
    marginBottom: 32,
  },
  moonEmoji: {
    fontSize: 80,
  },
  branding: {
    alignItems: "center",
    marginBottom: 48,
  },
  appName: {
    fontSize: 42,
    color: "#E5EB83", // Sacred gold
    marginBottom: 8,
  },
  tagline: {
    color: "#B3B3B3",
    opacity: 0.9,
  },
  description: {
    marginBottom: 64,
    maxWidth: width * 0.8,
  },
  descText: {
    lineHeight: 24,
    color: "#B3B3B3",
  },
  actions: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    marginBottom: 8,
  },
  ghostButton: {
    marginTop: 8,
  },
});
