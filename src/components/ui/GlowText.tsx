import React from "react";
import { Text, TextStyle } from "react-native";
import { createTextGlow, typography } from "@/constants/GlobalStyles";
import { theme } from "@/constants/Colors";

interface GlowTextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "error";
  textStyle?: "status" | "title" | "hint" | "duration" | "transcriptionTitle";
  glowIntensity?: number;
  style?: TextStyle;
  align?: "left" | "center" | "right";
}

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  variant = "primary",
  textStyle = "status",
  glowIntensity = 6,
  style,
  align = "center",
}) => {
  const glowColors = {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    error: theme.error,
  };
  const textStyles = {
    status: typography.status,
    title: typography.title,
    hint: typography.hint,
    duration: typography.duration,
    transcriptionTitle: typography.transcriptionTitle,
  };
  return (
    <Text
      style={[
        typography.base,
        textStyles[textStyle],
        createTextGlow(glowColors[variant], glowIntensity),
        { color: glowColors[variant], textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
