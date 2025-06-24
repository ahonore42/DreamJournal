import React from "react";
import { Alert } from "react-native";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { GlowText } from "../ui/GlowText";
import { UserInfoCard } from "../ui/UserInfoCard";
import { ActionGroup } from "../ui/ActionGroup";

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
    <>
      {/* User Info */}
      <UserInfoCard
        name={`Welcome, ${user?.name || "Dream Seeker"}`}
        email={user?.email || "Sacred Journey"}
        avatarEmoji="🌟"
      />
      {/* Quick Actions */}
      <ActionGroup variant="withMargin">
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
        />

        <Button
          title="⚙️ Sacred Settings"
          onPress={() =>
            Alert.alert("Feature Coming Soon", "Settings will be available in a future update.")
          }
          variant="primary"
          size="large"
        />
      </ActionGroup>

      {/* Sign Out Section */}
      <ActionGroup variant="bottom">
        <GlowText variant="secondary" textStyle="hint" align="center">
          Ready to end your current sacred session?
        </GlowText>

        <Button
          title="🚪 End Sacred Journey"
          onPress={handleSignOut}
          variant="primary"
          ghost
          size="large"
          style={{ minWidth: 200 }}
        />
      </ActionGroup>
    </>
  );
}
