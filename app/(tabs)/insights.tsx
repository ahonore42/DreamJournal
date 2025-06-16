import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View } from "@/components/layout/Themed";
import { StyledText } from "@/components/ui/StyledText";
import { Button } from "@/components/ui/Button";
import StarryBackground from "@/components/layout/StarryBackground";

export default function InsightsScreen() {
  return (
    <StarryBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <StyledText variant="h2" align="center" style={styles.title}>
            🔮 Sacred Insights
          </StyledText>
          <StyledText variant="caption" align="center" style={styles.subtitle}>
            Deep analysis of your dream patterns
          </StyledText>
        </View>

        <View style={styles.placeholder}>
          <StyledText variant="body" align="center" style={styles.placeholderText}>
            Sacred wisdom awaits. Your dream patterns and spiritual insights will be revealed here
            through mystical analysis.
          </StyledText>

          <Button
            title="🌟 Begin Analysis"
            onPress={() => console.log("Starting dream analysis")}
            variant="secondary"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </StarryBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 48,
    paddingTop: 20,
  },
  title: {
    color: "#5199A8",
    marginBottom: 8,
  },
  subtitle: {
    color: "#B3B3B3",
  },
  placeholder: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  placeholderText: {
    color: "#B3B3B3",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});
