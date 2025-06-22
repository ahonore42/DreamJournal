import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "react-native";
import { surfaces, shadows, typography } from "@/constants/GlobalStyles";

interface ErrorContainerProps {
  message: string;
  style?: ViewStyle;
}

export const ErrorContainer: React.FC<ErrorContainerProps> = ({ message, style }) => {
  return (
    <View style={[surfaces.error, shadows.error, style]}>
      <Text style={typography.errorText}>{message}</Text>
    </View>
  );
};
