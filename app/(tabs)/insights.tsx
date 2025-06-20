import React from "react";
import { Alert, StyleSheet } from "react-native";
import { StyledText } from "@/components/ui/StyledText";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/ActionGroup";

import { ScreenLayout } from "@/components/layout/ScreenLayout";

export default function InsightsScreen() {
  return (
    <ScreenLayout scroll title="🔮 Dream Insights" subtitle="Deep analysis of your dream patterns">
      <StyledText variant="body" align="center" style={styles.placeholderText}>
        Sacred wisdom awaits. Your dream patterns and spiritual insights will be revealed here
        through mystical analysis.
      </StyledText>
      <ActionGroup variant="withMargin">
        <Button
          title="🌟 Begin Analysis"
          onPress={() =>
            Alert.alert("Feature Coming Soon", "Insights will be available in a future update.")
          }
          variant="secondary"
          size="large"
        />
      </ActionGroup>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  placeholderText: {
    color: "#B3B3B3",
    lineHeight: 24,
    marginBottom: 32,
  },
});
