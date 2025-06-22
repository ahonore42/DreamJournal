import React from "react";
import { View, ViewStyle } from "react-native";
import { layouts, typography } from "@/constants/GlobalStyles";
import { Avatar } from "./Avatar";
import { Text } from "@/components/layout/Themed";
import { theme } from "@/constants/Colors";

interface UserInfoCardProps {
  name: string;
  email: string;
  avatarEmoji?: string;
  style?: ViewStyle;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  name,
  email,
  avatarEmoji = "🌙",
  style,
}) => {
  return (
    <View style={[layouts.userInfo, style]}>
      <View style={layouts.userSection}>
        <Avatar emoji={avatarEmoji} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={[typography.title, { color: theme.sacred, fontSize: 18, marginBottom: 4 }]}>
            {name}
          </Text>
          <Text
            style={[
              typography.subtitle,
              { color: theme.textSecondary, fontSize: 14, opacity: 0.8 },
            ]}
          >
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
};
