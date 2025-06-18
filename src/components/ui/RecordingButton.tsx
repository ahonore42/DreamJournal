import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { FlowerOfLifeSVG } from "../atoms/FlowerOfLifeSVG";
import { theme } from "@/constants/Colors";

/**
 * Recording Button Component with Haptic Feedback.
 * Manages button state, animation triggers, and passes color props to FlowerOfLifeSVG.
 */
export const RecordingButton: React.FC<{
  isRecording: boolean;
  isTranscribing: boolean;
  onPress: () => void;
  breathingAnim: Animated.Value;
  pulseAnim: Animated.Value;
  containerScaleAnim: Animated.Value;
  isButtonDisabled: boolean;
  transcriptionExists: boolean;
  forceDefaultColor?: boolean;
}> = ({
  isRecording,
  isTranscribing,
  onPress,
  isButtonDisabled,
  transcriptionExists,
  forceDefaultColor = false,
}) => {
  const [currentDisplayColor, setCurrentDisplayColor] = useState<string>(theme.primary);
  const [containerBorderColor, setContainerBorderColor] = useState<string>(theme.primary);
  const [triggerRipple, setTriggerRipple] = useState(false);

  // Create a simple scale animation
  const scaleValue = useRef(new Animated.Value(1)).current;
  const containerTimeoutRef = useRef<any>(null);

  const TRANSITION_TIMEOUT = 500;

  // Enhanced haptic feedback function
  const triggerHapticFeedback = useCallback(async () => {
    try {
      if (isRecording) {
        // Stopping recording - use a more substantial feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Add a subtle second pulse for "completion" feeling
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 100);
      } else if (!isTranscribing && !transcriptionExists) {
        // Starting recording - use a strong, confident feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // Add a gentle follow-up to signify "activation"
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 150);
      }
    } catch (error) {
      // Haptics might not be available on all devices/simulators
      console.log("Haptic feedback not available:", error);
    }
  }, [isRecording, isTranscribing, transcriptionExists]);

  // Enhanced onPress handler with haptics
  const handlePress = useCallback(() => {
    // Trigger haptic feedback first for immediate response
    triggerHapticFeedback();

    // Then call the original onPress
    onPress();
  }, [triggerHapticFeedback, onPress]);

  // Helper function to determine the target color based on the current state
  const getTargetColor = useCallback(() => {
    if (forceDefaultColor) return theme.primary;
    if (isRecording) return theme.accent;
    if (isTranscribing) return theme.secondary;
    if (transcriptionExists) return theme.secondary;
    return theme.primary;
  }, [
    isRecording,
    isTranscribing,
    transcriptionExists,
    forceDefaultColor,
    theme.primary,
    theme.accent,
  ]);

  // Calculate button state styling
  const getButtonState = useCallback(() => {
    const baseState = {
      glowIntensity: 0.7,
      shadowOpacity: 0.5,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 12,
      backgroundColor: "#0A0A1A",
    };

    return {
      ...baseState,
      glowIntensity: isRecording ? 1.0 : isTranscribing ? 0.9 : 0.7,
      shadowOpacity: isRecording ? 0.8 : isTranscribing ? 0.6 : 0.5,
      shadowRadius: isRecording ? 20 : isTranscribing ? 16 : 12,
      elevation: isRecording ? 20 : isTranscribing ? 16 : 12,
      shadowColor: currentDisplayColor,
      backgroundColor: isRecording
        ? "#1A1A2E"
        : isTranscribing
          ? "#2A2A1A"
          : baseState.backgroundColor,
    };
  }, [isRecording, isTranscribing, currentDisplayColor]);

  const buttonState = getButtonState();

  // Simple scale animation that MUST work
  useEffect(() => {
    if (isRecording) {
      // Force reset
      scaleValue.setValue(1);

      // Create a simple animation
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2, // Bigger scale to make it obvious
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );

      anim.start();

      return () => {
        anim.stop();
        scaleValue.setValue(1);
      };
    } else {
      scaleValue.setValue(1);
    }
  }, [isRecording]);

  // Handle color transitions
  useEffect(() => {
    // Handle forced color reset
    if (forceDefaultColor) {
      setCurrentDisplayColor(theme.primary);
      setContainerBorderColor(theme.primary);
      setTriggerRipple(false);
      if (containerTimeoutRef.current) {
        clearTimeout(containerTimeoutRef.current);
        containerTimeoutRef.current = null;
      }
      return;
    }

    // Calculate target color
    const targetColor = getTargetColor();

    // Handle color transitions
    if (targetColor !== currentDisplayColor) {
      setTriggerRipple(true);

      // Clear any existing container timeout
      if (containerTimeoutRef.current) {
        clearTimeout(containerTimeoutRef.current);
      }

      // Start container border animation
      containerTimeoutRef.current = setTimeout(() => {
        setContainerBorderColor(targetColor);
        containerTimeoutRef.current = null;
      }, TRANSITION_TIMEOUT + 10);

      // Update FlowerOfLifeSVG color after transition
      const flowerTimeoutId = setTimeout(() => {
        setCurrentDisplayColor(targetColor);
        setTriggerRipple(false);
      }, TRANSITION_TIMEOUT);

      return () => {
        clearTimeout(flowerTimeoutId);
      };
    } else {
      setTriggerRipple(false);
    }
  }, [
    isRecording,
    isTranscribing,
    currentDisplayColor,
    transcriptionExists,
    forceDefaultColor,
    theme.primary,
    getTargetColor,
  ]);

  // Add state change haptics for enhanced UX
  useEffect(() => {
    // Gentle notification haptic when transcription completes
    if (transcriptionExists && !isTranscribing) {
      const timer = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 300); // Small delay to let visual transition settle

      return () => clearTimeout(timer);
    }
  }, [transcriptionExists, isTranscribing]);

  return (
    <View style={styles.sacredContainer}>
      <Animated.View
        style={[
          styles.sacredButton,
          {
            backgroundColor: buttonState.backgroundColor,
            borderColor: containerBorderColor,
            shadowColor: buttonState.shadowColor,
            shadowOpacity: buttonState.shadowOpacity,
            shadowRadius: buttonState.shadowRadius,
            shadowOffset: buttonState.shadowOffset,
            elevation: buttonState.elevation,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
          disabled={triggerRipple || isButtonDisabled}
          style={styles.touchArea}
        >
          <FlowerOfLifeSVG
            size={180}
            strokeColor={currentDisplayColor}
            nextStrokeColor={getTargetColor()}
            strokeWidth={2}
            glowOpacity={buttonState.glowIntensity}
            triggerRipple={triggerRipple}
            transitionTimeout={TRANSITION_TIMEOUT}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sacredContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sacredButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  touchArea: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
