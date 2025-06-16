import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { View } from "@/components/layout/Themed";
import { StyledText } from "@/components/ui/StyledText";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import StarryBackground from "@/components/layout/StarryBackground";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { signIn } = useAuth();

  const handleSignIn = () => {
    // Just call signIn - the root layout will handle navigation automatically
    signIn();
  };

  return (
    <StarryBackground>
      <View style={styles.container}>
        {/* Sacred Moon Symbol */}
        <View style={styles.moonContainer}>
          <StyledText variant="h1" align="center" style={styles.moonEmoji}>
            🌙
          </StyledText>
        </View>

        {/* App Branding */}
        <View style={styles.branding}>
          <StyledText variant="h1" align="center" style={styles.appName}>
            DreamJournal
          </StyledText>
          <StyledText variant="mantra" align="center" style={styles.tagline}>
            Capture the wisdom of your dreams
          </StyledText>
        </View>

        {/* Sacred Description */}
        <View style={styles.description}>
          <StyledText variant="body" align="center" style={styles.descText}>
            Welcome to your sacred space for dream exploration. Begin your journey into the mystical
            realm of consciousness.
          </StyledText>
        </View>

        {/* Sacred Actions */}
        <View style={styles.actions}>
          <Button
            title="✨ Begin Your Journey"
            onPress={handleSignIn}
            variant="sacred"
            size="large"
            style={styles.primaryButton}
          />

          <Button
            title="🔮 Sign In"
            onPress={handleSignIn}
            variant="primary"
            ghost
            size="medium"
            style={styles.ghostButton}
          />
        </View>
      </View>
    </StarryBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
