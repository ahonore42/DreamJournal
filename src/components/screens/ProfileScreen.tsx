import React from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { View } from "@/components/layout/Themed";
import { StyledText } from "@/components/ui/StyledText";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to end your sacred journey?", [
      {
        text: "Continue Journey",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <StyledText variant="h2" align="center" style={styles.title}>
          🌟 Sacred Profile
        </StyledText>
        <StyledText variant="caption" align="center" style={styles.subtitle}>
          Your spiritual journey dashboard
        </StyledText>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <StyledText variant="h3" align="center" style={styles.userName}>
          Welcome, {user?.name}
        </StyledText>
        <StyledText variant="body" align="center" style={styles.userEmail}>
          {user?.email}
        </StyledText>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <Button
          title="🌙 Dream Statistics"
          onPress={() =>
            Alert.alert(
              "Feature Coming Soon",
              "Dream statistics will be available in a future update.",
            )
          }
          variant="secondary"
          size="large"
          style={styles.actionButton}
        />

        <Button
          title="⚙️ Sacred Settings"
          onPress={() =>
            Alert.alert("Feature Coming Soon", "Settings will be available in a future update.")
          }
          variant="primary"
          size="large"
          style={styles.actionButton}
        />
      </View>

      {/* Sign Out Section */}
      <View style={styles.signOutSection}>
        <StyledText variant="body" align="center" style={styles.signOutDescription}>
          Ready to end your current sacred session?
        </StyledText>

        <Button
          title="🚪 End Sacred Journey"
          onPress={handleSignOut}
          variant="primary"
          ghost
          size="large"
          style={styles.signOutButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    color: "#5199A8",
    marginBottom: 8,
  },
  subtitle: {
    color: "#B3B3B3",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 48,
    padding: 24,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  userName: {
    color: "#E5EB83",
    marginBottom: 8,
  },
  userEmail: {
    color: "#B3B3B3",
    opacity: 0.8,
  },
  actions: {
    gap: 16,
    marginBottom: 48,
  },
  actionButton: {
    marginBottom: 8,
  },
  signOutSection: {
    alignItems: "center",
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 92, 246, 0.2)",
  },
  signOutDescription: {
    color: "#B3B3B3",
    marginBottom: 24,
    opacity: 0.8,
  },
  signOutButton: {
    minWidth: 200,
  },
});
