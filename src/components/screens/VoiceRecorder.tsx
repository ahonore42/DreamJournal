import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Animated, Alert } from "react-native";
import { Text } from "@/components/layout/Themed";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useDreamStore } from "@/hooks/useDreamStore";
import { theme } from "@/constants/Colors";
import { RecordingButton } from "../ui/RecordingButton";
import { Button } from "../ui/Button";

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
            <View style={styles.transcriptionArea}>
              <Text
                style={[
                  styles.transcriptionTitle,
                  {
                    color: theme.secondary,
                    textShadowColor: theme.secondary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  },
                ]}
              >
                ✨ Dream Transcription
              </Text>

              {isTranscribing && !transcription ? (
                <View style={styles.transcribing}>
                  <Text
                    style={[
                      styles.transcribingText,
                      {
                        color: theme.text,
                        textShadowColor: theme.primary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      },
                    ]}
                  >
                    🔮 Converting your sacred words to text...
                  </Text>
                </View>
              ) : (
                <View style={styles.dreamTextContainer}>
                  <Text style={[styles.dreamText, error === "speech_error" && styles.errorText]}>
                    {displayText}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {isRecording && partialTranscription && (
          <Animated.View
            style={[
              styles.partialTranscriptionOverlay,
              {
                opacity: partialOpacity,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                borderColor: theme.accent,
              },
            ]}
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
          </Animated.View>
        )}

        {error && error !== "speech_error" && (
          <View
            style={[
              styles.errorContainer,
              {
                shadowColor: "#F44336",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
            ]}
          >
            <Text style={styles.errorText}>{error}</Text>
          </View>
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
            <Text
              style={[
                styles.completionText,
                {
                  color: error === "speech_error" ? "#FF6B6B" : theme.primary,
                  textShadowColor: error === "speech_error" ? "#F44336" : theme.primary,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 6,
                },
              ]}
            >
              {error === "speech_error" ? "Recording failed" : "Dream transcription complete"}
            </Text>

            {confidence > 0 && error !== "speech_error" && (
              <Text style={styles.bottomConfidenceText}>
                Confidence: {Math.round(confidence * 100)}%
              </Text>
            )}

            <View style={styles.bottomButtons}>
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
            </View>
          </Animated.View>
        ) : (
          <>
            <View style={styles.statusArea}>
              <Text
                style={[
                  styles.status,
                  {
                    color: theme.primary,
                    textShadowColor: theme.primary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 6,
                  },
                ]}
              >
                {isRecording
                  ? "Listening to your sacred dreams..."
                  : isTranscribing
                    ? "Processing your words..."
                    : "Touch the sacred geometry to begin"}
              </Text>

              {isRecording && (
                <>
                  <Text
                    style={[
                      styles.hint,
                      {
                        color: theme.text,
                        textShadowColor: theme.secondary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      },
                    ]}
                  >
                    Speak naturally. Your words are being captured in real-time.
                  </Text>

                  <Text
                    style={[
                      styles.duration,
                      {
                        color: theme.accent,
                        textShadowColor: theme.accent,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      },
                    ]}
                  >
                    {formatDuration(duration)}
                  </Text>
                </>
              )}
            </View>

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
  container: {
    flex: 1,
    padding: 16,
  },
  topContent: {
    flex: 1,
    minHeight: 0,
  },
  transcriptionContainer: {
    flex: 1,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  statusArea: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  recordingArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
  },
  transcriptionArea: {
    flex: 1,
    padding: 20,
    marginBottom: 16,
    minHeight: 200,
  },
  transcriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  transcribing: {
    alignItems: "center",
    paddingVertical: 24,
  },
  transcribingText: {
    fontSize: 16,
    textAlign: "center",
  },
  dreamTextContainer: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  dreamText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    letterSpacing: 0.3,
    color: "#FFFFFF",
    textAlign: "left",
  },
  errorText: {
    color: "#FF6B6B",
    fontStyle: "italic",
    textAlign: "center",
  },
  partialTranscriptionOverlay: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  partialText: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderWidth: 1,
    borderColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  completionArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  completionText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  bottomConfidenceText: {
    fontSize: 14,
    textAlign: "center",
    color: "#9CA3AF",
    opacity: 0.8,
    marginBottom: 32,
    fontStyle: "italic",
  },
  bottomButtons: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 16,
  },
});
