import React from "react";
import { View, ViewStyle } from "react-native";
import { layouts } from "@/constants/GlobalStyles";

interface ActionGroupProps {
  children: React.ReactNode;
  variant?: "default" | "withMargin" | "bottom";
  style?: ViewStyle;
}
export const ActionGroup: React.FC<ActionGroupProps> = ({
  children,
  variant = "default",
  style,
}) => {
  const variantStyles = {
    default: layouts.actions,
    withMargin: layouts.actionsWithMargin,
    bottom: layouts.bottomSection,
  };
  return <View style={[variantStyles[variant], style]}>{children}</View>;
};
