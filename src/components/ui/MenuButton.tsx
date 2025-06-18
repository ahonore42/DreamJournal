import React, { useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { theme } from "@/constants/Colors";

interface MenuButtonProps {
  onPress: () => void;
  isMenuOpen: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onPress, isMenuOpen }) => {
  // Subtle but extremely satisfying haptic feedback
  const triggerHapticFeedback = useCallback(async () => {
    try {
      if (isMenuOpen) {
        // Closing menu - gentle, refined completion
        await Haptics.selectionAsync();
        // Whisper-soft settling pulse that feels like silk
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }, 150);
      } else {
        // Opening menu - soft but confident engagement
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        // Delicate follow-up that feels like a gentle breath
        setTimeout(() => {
          Haptics.selectionAsync();
        }, 150);
      }
    } catch (error) {
      // Haptics might not be available on all devices/simulators
      console.log("Haptic feedback not available:", error);
    }
  }, [isMenuOpen]);

  // Enhanced onPress handler with gentle, immediate haptic response
  const handlePress = useCallback(() => {
    // Trigger subtle haptic feedback BEFORE the visual animation for refined satisfaction
    triggerHapticFeedback();

    // Then call the original onPress
    onPress();
  }, [triggerHapticFeedback, onPress]);

  // Animated styles for the hamburger lines with refined easing
  const topLineStyle = useAnimatedStyle(() => {
    const rotation = withTiming(isMenuOpen ? 45 : 0, {
      duration: 350, // Slightly slower for elegance
    });
    const translateY = withTiming(isMenuOpen ? 8 : 0, { duration: 350 });

    return {
      transform: [{ translateY }, { rotate: `${rotation}deg` }],
    };
  });

  const middleLineStyle = useAnimatedStyle(() => {
    const opacity = withTiming(isMenuOpen ? 0 : 1, { duration: 350 });
    const scaleX = withTiming(isMenuOpen ? 0 : 1, { duration: 350 });

    return {
      opacity,
      transform: [{ scaleX }],
    };
  });

  const bottomLineStyle = useAnimatedStyle(() => {
    const rotation = withTiming(isMenuOpen ? -45 : 0, { duration: 350 });
    const translateY = withTiming(isMenuOpen ? -8 : 0, { duration: 350 });

    return {
      transform: [{ translateY }, { rotate: `${rotation}deg` }],
    };
  });

  // Subtle container animation with refined feedback
  const containerStyle = useAnimatedStyle(() => {
    const scale = withTiming(isMenuOpen ? 1.05 : 1, {
      duration: 350, // Slightly slower for elegance
    });

    // Very subtle glow effect when active
    const shadowOpacity = withTiming(isMenuOpen ? 0.15 : 0.05, { duration: 350 });

    return {
      transform: [{ scale }],
      shadowOpacity,
    };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8} // More subtle press feedback
      accessibilityRole="button"
      accessibilityLabel={isMenuOpen ? "Close menu" : "Open menu"}
      // Larger touch area for better UX
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 4,
          },
        ]}
      >
        <Animated.View style={[styles.line, { backgroundColor: theme.primary }, topLineStyle]} />
        <Animated.View style={[styles.line, { backgroundColor: theme.primary }, middleLineStyle]} />
        <Animated.View style={[styles.line, { backgroundColor: theme.primary }, bottomLineStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 24,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    borderRadius: 4, // Subtle rounding for visual polish
  },
  line: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
