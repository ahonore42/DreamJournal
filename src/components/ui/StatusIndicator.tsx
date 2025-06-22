import React from "react";
import { View, ViewStyle } from "react-native";
import { layouts } from "@/constants/GlobalStyles";
import { GlowText } from "./GlowText";

interface StatusIndicatorProps {
  title: string;
  subtitle?: string;
  duration?: string;
  variant?: "primary" | "secondary" | "accent" | "error";
  style?: ViewStyle;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  title,
  subtitle,
  duration,
  variant = "primary",
  style,
}) => {
  return (
    <View style={[layouts.statusArea, style]}>
      <GlowText variant={variant} textStyle="status">
        {title}
      </GlowText>
      {subtitle && (
        <GlowText variant={variant} textStyle="hint">
          {subtitle}
        </GlowText>
      )}

      {duration && (
        <GlowText variant={variant} textStyle="duration">
          {duration}
        </GlowText>
      )}
    </View>
  );
};
