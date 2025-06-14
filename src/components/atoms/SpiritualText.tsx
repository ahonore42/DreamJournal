import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/Colors";

export interface SpiritualTextProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "mantra";
  align?: "left" | "center" | "right";
  style?: TextStyle;
}

export function SpiritualText({
  children,
  variant = "body",
  align = "left",
  style,
}: SpiritualTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const textStyle = [
    styles.base,
    styles[variant],
    { color: colors.text },
    { textAlign: align },
    style,
  ];

  return <Text style={textStyle}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.5, // Enhanced spacing for meditation readability
  },
  h1: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 45,
    marginBottom: 16,
  },
  h2: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 37,
    marginBottom: 12,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 26, // Relaxed line height for readability
  },
  caption: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.7,
  },
  mantra: {
    fontSize: 18,
    lineHeight: 36, // Loose line height for contemplation
    letterSpacing: 1, // Extra wide spacing for mantras
    textAlign: "center",
    fontWeight: "500",
    fontStyle: "italic",
  },
});
