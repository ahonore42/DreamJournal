import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledText } from "@/components/ui/StyledText";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/constants/Colors";
import { MenuItem } from "../ui/MenuItem";
import { GlowText } from "../ui/GlowText";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MENU_WIDTH = SCREEN_WIDTH * 0.8;

// Header heights for different platforms
const HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 56,
});

interface NavigationMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  color?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  // Calculate total header height including status bar
  const totalHeaderHeight = HEADER_HEIGHT + insets.top;

  // Animation values
  const slideAnim = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const itemsOpacity = useSharedValue(0);

  // State to track when animations are complete
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleSignOut = () => {
    Alert.alert("End Sacred Journey", "Are you sure you want to sign out of your mystical realm?", [
      {
        text: "Continue Journey",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          onClose();
          setTimeout(() => signOut(), 300);
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      id: "sacred-space",
      title: "Sacred Space",
      icon: "moon-o",
      route: "/(tabs)",
      color: theme.primary,
    },
    {
      id: "timeline",
      title: "Dream Timeline",
      icon: "calendar",
      route: "/(tabs)/two",
      color: theme.secondary,
    },
    {
      id: "insights",
      title: "Sacred Insights",
      icon: "eye",
      route: "/(tabs)/insights",
      color: theme.accent,
    },
    {
      id: "profile",
      title: "Spiritual Profile",
      icon: "user",
      route: "/(tabs)/profile",
      color: theme.violet,
    },
    {
      id: "divider",
      title: "",
      icon: "",
    },
    {
      id: "settings",
      title: "Mystical Settings",
      icon: "cog",
      action: () => Alert.alert("Settings", "Sacred settings coming soon..."),
      color: theme.emerald,
    },
    {
      id: "help",
      title: "Cosmic Guidance",
      icon: "question-circle",
      action: () => Alert.alert("Help", "Spiritual guidance coming soon..."),
      color: theme.aquaBlue,
    },
    {
      id: "sign-out",
      title: "End Journey",
      icon: "sign-out",
      action: handleSignOut,
      color: "#FF6B6B",
    },
  ];

  const handleItemPress = (item: MenuItem) => {
    if (item.route) {
      onClose();
      setTimeout(() => router.push(item.route as any), 300);
    } else if (item.action) {
      item.action();
    }
  };

  // Animation effects
  useEffect(() => {
    if (isVisible) {
      setIsAnimationComplete(false);
      slideAnim.value = withSpring(1, {
        damping: 20,
        stiffness: 90,
      });
      overlayOpacity.value = withTiming(1, { duration: 300 });
      itemsOpacity.value = withTiming(1, { duration: 400 });
    } else {
      slideAnim.value = withTiming(
        0,
        {
          duration: 250,
        },
        (finished) => {
          if (finished) {
            runOnJS(setIsAnimationComplete)(true);
          }
        },
      );
      overlayOpacity.value = withTiming(0, { duration: 250 });
      itemsOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? "auto" : "none",
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(slideAnim.value, [0, 1], [-MENU_WIDTH, 0]),
      },
    ],
  }));

  const itemsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: itemsOpacity.value,
    transform: [
      {
        translateX: interpolate(itemsOpacity.value, [0, 1], [-50, 0]),
      },
    ],
  }));

  if (!isVisible && isAnimationComplete) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        overlayAnimatedStyle,
        { top: totalHeaderHeight }, // Position below header
      ]}
    >
      {/* Blur overlay - now starts below header */}
      <TouchableOpacity style={styles.overlayTouch} activeOpacity={1} onPress={onClose}>
        <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
      </TouchableOpacity>

      {/* Menu Panel - slides in below header */}
      <Animated.View
        style={[
          styles.menuPanel,
          menuAnimatedStyle,
          { height: SCREEN_HEIGHT - totalHeaderHeight }, // Adjust height
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <StyledText variant="h2" style={styles.avatarText}>
                🌙
              </StyledText>
            </View>
            <View style={styles.userInfo}>
              <StyledText variant="h3" style={styles.userName}>
                {user?.name || "Dream Seeker"}
              </StyledText>
              <StyledText variant="caption" style={styles.userEmail}>
                {user?.email || "Sacred Journey"}
              </StyledText>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <Animated.View style={[styles.menuItems, itemsAnimatedStyle]}>
          {menuItems.map((item, index) => {
            if (item.id === "divider") {
              return <View key={item.id} style={styles.divider} />;
            }

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  {
                    borderLeftColor: item.color || theme.primary,
                  },
                ]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome
                    name={item.icon as any}
                    size={20}
                    color={item.color || theme.primary}
                    style={styles.menuItemIcon}
                  />
                  <StyledText variant="body" style={styles.menuItemText}>
                    {item.title}
                  </StyledText>
                </View>

                <FontAwesome
                  name="chevron-right"
                  size={14}
                  color={theme.text}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <GlowText variant="primary" style={styles.footerText}>
            ✨ DreamJournal v1.0 ✨
          </GlowText>
          <StyledText variant="caption" style={styles.footerSubtext}>
            Explore the cosmos within
          </StyledText>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayTouch: {
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  menuPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: "#0A0E1A",
    borderRightWidth: 1,
    borderRightColor: "rgba(139, 92, 246, 0.3)",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 92, 246, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#E5EB83",
    marginBottom: 2,
  },
  userEmail: {
    color: "#B3B3B3",
    opacity: 0.8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    marginVertical: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  menuItemText: {
    color: "#E5E7EB",
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    marginVertical: 12,
    marginHorizontal: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 92, 246, 0.2)",
    alignItems: "center",
  },
  footerText: {
    marginBottom: 4,
  },
  footerSubtext: {
    color: "#B3B3B3",
    opacity: 0.7,
    fontSize: 12,
  },
});
