import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View } from "@/components/layout/Themed";
import { StyledText } from "@/components/ui/StyledText";
import StarryBackground from "@/components/layout/StarryBackground";
import { theme } from "@/constants/Colors";

interface ScreenLayoutProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  scroll?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  subtitle,
  children,
  scroll,
}) => {
  return (
    <StarryBackground>
      {scroll ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <StyledText variant="h2" align="center" style={styles.title}>
              {title}
            </StyledText>
            <StyledText variant="caption" align="center" style={styles.subtitle}>
              {subtitle}
            </StyledText>
          </View>
          {children}
        </ScrollView>
      ) : (
        <View style={{ ...styles.container, ...styles.content }}>
          <View style={styles.header}>
            <StyledText variant="h2" align="center" style={styles.title}>
              {title}
            </StyledText>
            <StyledText variant="caption" align="center" style={styles.subtitle}>
              {subtitle}
            </StyledText>
          </View>
          {children}
        </View>
      )}
    </StarryBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    color: theme.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: "#B3B3B3",
  },
});
