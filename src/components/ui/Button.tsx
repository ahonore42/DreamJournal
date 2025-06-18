import React, { useCallback, useState } from "react";
import { StyleSheet, ViewStyle, View, Pressable, LayoutChangeEvent } from "react-native";
import { Text } from "@/components/layout/Themed";
import { theme } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "sacred";
  ghost?: boolean;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  ghost = false,
  size = "medium",
  style,
  disabled = false,
}: ButtonProps) {
  // Track button dimensions
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 });

  // Animation values
  const scale = useSharedValue(1);
  const gleamScale = useSharedValue(0);
  const gleamOpacity = useSharedValue(0);

  // Calculate the gleam size needed to cover the entire button
  // Use diagonal to ensure coverage even at corners, with slight extra margin
  const gleamSize =
    Math.sqrt(
      buttonDimensions.width * buttonDimensions.width +
        buttonDimensions.height * buttonDimensions.height,
    ) * 1.2; // 1.2x to ensure full coverage with margin

  // Haptic feedback
  const triggerPressInHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const triggerPressOutHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Handle button layout to get dimensions
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setButtonDimensions({ width, height });
  }, []);

  // Handle press in
  const handlePressIn = useCallback(() => {
    "worklet";

    // Button scale animation
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 300,
    });

    // Radial gleam effect - starts from center and expands to fill button
    gleamScale.value = 0.1; // Start slightly visible
    gleamOpacity.value = 1;

    // Scale from 0.1 to 1 (where 1 = full gleam size)
    gleamScale.value = withTiming(1, {
      duration: 300,
    });
    gleamOpacity.value = withTiming(0, {
      duration: 300,
    });

    runOnJS(triggerPressInHaptic)();
  }, [scale, gleamScale, gleamOpacity, triggerPressInHaptic]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    "worklet";

    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });

    runOnJS(triggerPressOutHaptic)();
  }, [scale, triggerPressOutHaptic]);

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedGleamStyle = useAnimatedStyle(() => {
    return {
      opacity: gleamOpacity.value,
      transform: [{ scale: gleamScale.value }],
    };
  });

  // Get button color based on variant
  const getButtonColor = () => {
    switch (variant) {
      case "primary":
        return theme.primary;
      case "secondary":
        return theme.secondary;
      case "sacred":
        return theme.accent;
      default:
        return theme.primary;
    }
  };

  // Get gleam color
  const getGleamColor = () => {
    if (ghost) {
      // For ghost buttons, use the variant color with transparency
      return getButtonColor() + "40"; // 40 is ~25% opacity in hex
    }

    // For filled buttons, use white gleam with transparency
    return "rgba(255, 255, 255, 0.4)";
  };

  // Get shadow styles based on variant
  const getShadowStyle = () => {
    if (ghost) return {}; // No shadow for ghost buttons

    switch (variant) {
      case "primary":
        return styles.primaryShadow;
      case "secondary":
        return styles.secondaryShadow;
      case "sacred":
        return styles.sacredShadow;
      default:
        return {};
    }
  };

  // Button size styles
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  // Base button styles
  const buttonStyle = [
    styles.base,
    sizeStyles[size],
    ghost
      ? {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: getButtonColor(),
        }
      : {
          backgroundColor: getButtonColor(),
        },
    getShadowStyle(),
    disabled && styles.disabled,
    style,
  ];

  // Text color
  const textColor = ghost ? getButtonColor() : variant === "sacred" ? "#1A1A1A" : "#FFFFFF";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedButtonStyle]}
    >
      <View style={buttonStyle} onLayout={handleLayout}>
        {/* Radial gleam effect - only render if we have dimensions */}
        {buttonDimensions.width > 0 && (
          <Animated.View
            style={[
              styles.gleamOverlay,
              animatedGleamStyle,
              {
                width: gleamSize,
                height: gleamSize,
                borderRadius: gleamSize / 2,
                backgroundColor: getGleamColor(),
                marginLeft: -gleamSize / 2,
                marginTop: -gleamSize / 2,
              },
            ]}
            pointerEvents="none"
          />
        )}

        {/* Button text */}
        <Text
          style={[
            styles.text,
            styles[`${size}Text`],
            { color: textColor },
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    overflow: "hidden",
    position: "relative",
  },

  // Radial gleam overlay - centered absolutely
  gleamOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },

  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },

  // Shadows
  primaryShadow: {
    shadowColor: "#3359c5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryShadow: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  sacredShadow: {
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },

  // Typography
  text: {
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
    zIndex: 1,
  },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },

  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
