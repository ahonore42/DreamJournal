import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "react-native";
import { createAvatar, icons } from "@/constants/GlobalStyles";

interface AvatarProps {
  emoji?: string;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  emoji = "🌙",
  size = 50,
  backgroundColor = "rgba(139, 92, 246, 0.2)",
  borderColor = "#8B5CF6",
  style,
}) => {
  return (
    <View style={[createAvatar(size, backgroundColor, borderColor), style]}>
      <Text style={[icons.avatarText, { fontSize: size * 0.4 }]}>{emoji}</Text>
    </View>
  );
};
