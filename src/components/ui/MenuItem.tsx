import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { layouts, typography, icons, createMenuItem } from "@/constants/GlobalStyles";
import { Text } from "@/components/layout/Themed";
import { theme } from "@/constants/Colors";

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  onPress,
  color = theme.primary,
  style,
}) => {
  return (
    <TouchableOpacity style={[createMenuItem(color), style]} onPress={onPress} activeOpacity={0.7}>
      <View style={layouts.menuItemContent}>
        <FontAwesome name={icon as any} size={20} color={color} style={icons.menu} />
        <Text style={typography.menuItemText}>{title}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={theme.text} style={icons.chevron} />
    </TouchableOpacity>
  );
};
