import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Animated, Alert, ScrollView } from "react-native";
import { Text } from "@/components/layout/Themed";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useDreamStore } from "@/hooks/useDreamStore";
import { theme } from "@/constants/Colors";
// UI component imports
import { RecordingButton } from "../ui/RecordingButton";
import { Button } from "../ui/Button";
import { GlowText } from "../ui/GlowText";
import { TranscriptionArea } from "../ui/TranscriptionArea";
import { ErrorContainer } from "../ui/ErrorContainer";
import { ActionGroup } from "../ui/ActionGroup";
import { StatusIndicator } from "../ui/StatusIndicator";

export const VoiceRecorder: React.FC = () => {
  const {
    isRecording,
    isTranscribing,
    audioUri,
    transcription,
    partialTranscription,
    duration,
    error,
    confidence,
    startRecording,
    stopRecording,
    clearRecording,
    playRecording,
  } = useVoiceRecording();

  const { addDreamFromVoice } = useDreamStore();

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const breathingAnim = React.useRef(new Animated.Value(1)).current;
  const buttonOpacity = React.useRef(new Animated.Value(1)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const transcriptOpacity = React.useRef(new Animated.Value(0)).current;
  const transcriptTranslateY = React.useRef(new Animated.Value(50)).current;
  const partialOpacity = React.useRef(new Animated.Value(0)).current;

  const [forceButtonDefaultColor, setForceButtonDefaultColor] = useState(false);
  const hasFadedOutRef = useRef(false);
  const breathingAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const fadeOutButton = useCallback(() => {
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 0.8,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(transcriptOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(transcriptTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      if (finished) {
        setTimeout(() => {
          setForceButtonDefaultColor(true);
        }, 50);
      }
    });
  }, [buttonOpacity, buttonScale, transcriptOpacity, transcriptTranslateY]);

  const fadeInButton = useCallback(() => {
    setForceButtonDefaultColor(false);

    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(transcriptOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(transcriptTranslateY, {
        toValue: 50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonOpacity, buttonScale, transcriptOpacity, transcriptTranslateY]);

  const handleRecordingPress = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isTranscribing && !transcription) {
      startRecording();
    }
  };

  const handleSaveDream = useCallback(() => {
    if (transcription && error !== "speech_error") {
      try {
        const dreamId = addDreamFromVoice(transcription, confidence, duration);
        console.log(`✨ Dream saved with ID: ${dreamId}`);

        Alert.alert("Dream Saved ✨", "Your sacred dream has been added to your journal.", [
          {
            text: "View Timeline",
            onPress: () => {
              console.log("Navigate to timeline");
            },
          },
          {
            text: "Record Another",
            onPress: handleClearRecording,
            style: "default",
          },
        ]);
      } catch (error) {
        console.error("Failed to save dream:", error);
        Alert.alert("Save Failed", "There was an issue saving your dream. Please try again.", [
          { text: "OK" },
        ]);
      }
    }
  }, [transcription, confidence, duration, addDreamFromVoice, error]);

  const handleClearRecording = useCallback(() => {
    clearRecording();
    setForceButtonDefaultColor(true);
    hasFadedOutRef.current = false;

    buttonOpacity.setValue(0);
    buttonScale.setValue(0.8);
    transcriptOpacity.setValue(1);
    transcriptTranslateY.setValue(0);

    setTimeout(() => {
      fadeInButton();
    }, 50);
  }, [clearRecording, fadeInButton]);

  const isButtonTrulyDisabled = React.useMemo(() => {
    return !!transcription && !isTranscribing;
  }, [transcription, isTranscribing]);

  useEffect(() => {
    if (partialTranscription && isRecording) {
      Animated.timing(partialOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(partialOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [partialTranscription, isRecording]);

  useEffect(() => {
    if (isRecording) {
      breathingAnim.setValue(1);

      breathingAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1.15,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      );

      breathingAnimationRef.current.start();

      return () => {
        if (breathingAnimationRef.current) {
          breathingAnimationRef.current.stop();
          breathingAnimationRef.current = null;
        }
        breathingAnim.setValue(1);
      };
    } else {
      if (breathingAnimationRef.current) {
        breathingAnimationRef.current.stop();
        breathingAnimationRef.current = null;
      }
      breathingAnim.setValue(1);
    }
  }, [isRecording, breathingAnim]);

  useEffect(() => {
    if (isTranscribing) {
      pulseAnim.setValue(1);

      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      );

      pulseAnimationRef.current.start();

      return () => {
        if (pulseAnimationRef.current) {
          pulseAnimationRef.current.stop();
          pulseAnimationRef.current = null;
        }
        pulseAnim.setValue(1);
      };
    } else {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
      pulseAnim.setValue(1);
    }
  }, [isTranscribing, pulseAnim]);

  useEffect(() => {
    if (transcription && !isTranscribing && !isRecording && !hasFadedOutRef.current) {
      hasFadedOutRef.current = true;
      fadeOutButton();
    }
    if (!transcription) {
      hasFadedOutRef.current = false;
    }
  }, [transcription, isTranscribing, isRecording, fadeOutButton]);

  const getCurrentTranscriptionText = () => {
    if (transcription) return transcription;
    if (partialTranscription && isRecording) return partialTranscription;
    return "";
  };

  const displayText = getCurrentTranscriptionText();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Animated.View
          style={[
            styles.transcriptionContainer,
            {
              opacity: transcriptOpacity,
              transform: [{ translateY: transcriptTranslateY }],
            },
          ]}
        >
          {(displayText || isTranscribing) && (
            <TranscriptionArea
              content={displayText}
              isTranscribing={isTranscribing && !transcription}
              isError={error === "speech_error"}
            />
          )}
        </Animated.View>

        {isRecording && partialTranscription && (
          <Animated.View
            style={[
              styles.partialTranscriptionOverlay,
              {
                // Opacity can be animated separately if needed
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                borderColor: theme.accent,
                maxHeight: "80%",
              },
            ]}
          >
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              <Text
                style={[
                  styles.partialText,
                  {
                    color: theme.accent,
                  },
                ]}
              >
                {partialTranscription}
              </Text>
            </ScrollView>
          </Animated.View>
        )}

        {error && error !== "speech_error" && (
          <ErrorContainer message={error} style={styles.partialTranscriptionOverlay} />
        )}
      </View>

      <View style={styles.bottomHalf}>
        {transcription && !isTranscribing && !isRecording ? (
          <Animated.View
            style={[
              styles.completionArea,
              {
                opacity: transcriptOpacity,
                transform: [{ translateY: transcriptTranslateY }],
              },
            ]}
          >
            <GlowText variant={error === "speech_error" ? "error" : "primary"} textStyle="status">
              {error === "speech_error" ? "Recording failed" : "Dream transcription complete"}
            </GlowText>

            {confidence > 0 && error !== "speech_error" && (
              <Text style={styles.bottomConfidenceText}>
                Confidence: {Math.round(confidence * 100)}%
              </Text>
            )}

            <ActionGroup>
              <Button
                title={error === "speech_error" ? "❌ Cannot Save Error" : "💾 Save Dream"}
                onPress={handleSaveDream}
                variant="sacred"
                size="large"
                disabled={error === "speech_error"}
              />

              <Button
                title="🔄 Record Again"
                onPress={handleClearRecording}
                variant="secondary"
                ghost
                size="large"
              />
            </ActionGroup>
          </Animated.View>
        ) : (
          <>
            <StatusIndicator
              title={
                isRecording
                  ? "Listening to your sacred dreams..."
                  : isTranscribing
                    ? "Processing your words..."
                    : "Touch the sacred geometry to begin"
              }
              // subtitle={
              //   isRecording
              //     ? "Speak naturally. Your words are being captured in real-time."
              //     : undefined
              // }
              duration={isRecording ? formatDuration(duration) : undefined}
              variant={isRecording ? "accent" : "primary"}
            />

            <Animated.View
              style={[
                styles.recordingArea,
                {
                  opacity: buttonOpacity,
                  transform: [{ scale: buttonScale }],
                },
              ]}
              pointerEvents={isButtonTrulyDisabled ? "none" : "auto"}
            >
              <RecordingButton
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                onPress={handleRecordingPress}
                breathingAnim={breathingAnim}
                pulseAnim={pulseAnim}
                containerScaleAnim={buttonScale}
                isButtonDisabled={isButtonTrulyDisabled}
                transcriptionExists={!!transcription}
                forceDefaultColor={forceButtonDefaultColor}
              />
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // The main container fills the space and arranges the top and bottom sections.
  container: {
    flex: 1,
  },
  // The top section will expand to fill available space.
  topContent: {
    flex: 1,
    width: "100%",
  },
  // This container also expands and aligns its direct children (the TranscriptionArea component) to the top.
  transcriptionContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  // The bottom section has a fixed height, ensuring it's always at the bottom.
  bottomHalf: {
    height: 300, // A fixed height for the controls area
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20, // Padding at the very bottom of the screen.
  },
  recordingArea: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24, // Space between status and button
    width: "100%",
  },
  partialTranscriptionOverlay: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    // backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    textAlign: "left",
  },
  partialText: {
    fontSize: 16,
    textAlign: "left",
    fontStyle: "italic",
    fontWeight: "500",
  },
  // The completion area takes up the full space of the bottom half.
  completionArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomConfidenceText: {
    fontSize: 14,
    textAlign: "center",
    color: "#9CA3AF",
    opacity: 0.8,
    marginVertical: 16, // Consistent vertical spacing
    fontStyle: "italic",
  },
});
