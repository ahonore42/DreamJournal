import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View } from "@/components/Themed";
import { SpiritualText } from "@/components/atoms/SpiritualText";
import { SpiritualButton } from "@/components/atoms/SpiritualButton";

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <SpiritualText variant="h2" align="center" style={styles.title}>
          🔮 Sacred Insights
        </SpiritualText>
        <SpiritualText variant="caption" align="center" style={styles.subtitle}>
          Deep analysis of your dream patterns
        </SpiritualText>
      </View>

      <View style={styles.placeholder}>
        <SpiritualText variant="body" align="center" style={styles.placeholderText}>
          Sacred wisdom awaits. Your dream patterns and spiritual insights will be revealed here
          through mystical analysis.
        </SpiritualText>

        <SpiritualButton
          title="🌟 Begin Analysis"
          onPress={() => console.log("Starting dream analysis")}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
