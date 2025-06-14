import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface SpiritualButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "sacred";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export function SpiritualButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  style,
}: SpiritualButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const buttonStyle = [
    styles.base,
    styles[size],
    variant === "primary" && {
      backgroundColor: colors.primary,
      ...styles.primaryShadow,
    },
    variant === "secondary" && {
      backgroundColor: colors.secondary,
      ...styles.secondaryShadow,
    },
    variant === "ghost" && {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
    },
    variant === "sacred" && {
      backgroundColor: colors.accent,
      ...styles.sacredShadow,
    },
    style,
  ];

  const textColor =
    variant === "ghost" ? colors.primary : variant === "sacred" ? "#1A1A1A" : "#FFFFFF";

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.text, styles[`${size}Text`], { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12, // Sacred geometry - rounded corners
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // Accessibility touch target
  },

  // Sizes based on golden ratio (1.618)
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },

  // Sacred shadows with purple tints
  primaryShadow: {
    shadowColor: "#8C6184",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryShadow: {
    shadowColor: "#5199A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sacredShadow: {
    shadowColor: "#E5EB83",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },

  // Typography with enhanced spacing
  text: {
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },
});
