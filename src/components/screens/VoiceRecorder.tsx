import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text } from "@/components/layout/Themed";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RecordingButton } from "../ui/RecordingButton";
import { Button } from "../ui/Button";

export const VoiceRecorder: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const {
    isRecording,
    isTranscribing,
    audioUri,
    transcription,
    duration,
    error,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
  } = useVoiceRecording();

  // Animated values for breathing (while recording) and pulsing (while transcribing)
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const breathingAnim = React.useRef(new Animated.Value(1)).current;

  // Animated values for overall button and transcript transitions
  const buttonOpacity = React.useRef(new Animated.Value(1)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const transcriptOpacity = React.useRef(new Animated.Value(0)).current;
  const transcriptTranslateY = React.useRef(new Animated.Value(50)).current;

  // ButtonKey state - we don't want to re-mount the button
  const [forceButtonDefaultColor, setForceButtonDefaultColor] = useState(false);

  // Track if we've already faded out for this transcription
  const hasFadedOutRef = useRef(false);

  // Store animation references to ensure they persist
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
        // Reset color while invisible
        setTimeout(() => {
          setForceButtonDefaultColor(true);
        }, 50);
      }
    });
  }, [buttonOpacity, buttonScale, transcriptOpacity, transcriptTranslateY]);

  const fadeInButton = useCallback(() => {
    // Reset force flag before fading in
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

  const handleClearRecording = () => {
    clearRecording();
    setForceButtonDefaultColor(true);

    // Reset hasFadedOutRef
    hasFadedOutRef.current = false;

    // Set initial hidden state immediately (button should be at scale 0.8 when hidden)
    buttonOpacity.setValue(0);
    buttonScale.setValue(0.8);
    transcriptOpacity.setValue(1);
    transcriptTranslateY.setValue(0);

    // Animate to visible state
    setTimeout(() => {
      fadeInButton();
    }, 50);
  };

  // Determine if the button should be explicitly disabled
  const isButtonTrulyDisabled = React.useMemo(() => {
    return !!transcription && !isTranscribing;
  }, [transcription, isTranscribing]);

  // Breathing animation
  useEffect(() => {
    if (isRecording) {
      // Reset to starting value
      breathingAnim.setValue(1);

      // Create the breathing animation
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

  // Pulse animation
  useEffect(() => {
    if (isTranscribing) {
      // Reset to starting value
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

  // Fade out trigger
  useEffect(() => {
    if (transcription && !isTranscribing && !hasFadedOutRef.current) {
      hasFadedOutRef.current = true;
      fadeOutButton();
    }
    if (!transcription) {
      hasFadedOutRef.current = false;
    }
  }, [transcription, isTranscribing, fadeOutButton]);

  return (
    <View style={styles.container}>
      {/* Top Content Area - Transcription and Controls */}
      <View style={styles.topContent}>
        {/* Animated Transcription Display */}
        <Animated.View
          style={[
            styles.transcriptionContainer,
            {
              opacity: transcriptOpacity,
              transform: [{ translateY: transcriptTranslateY }],
            },
          ]}
        >
          {(transcription || isTranscribing) && (
            <View style={styles.transcriptionArea}>
              <Text
                style={[
                  styles.transcriptionTitle,
                  {
                    color: colors.secondary,
                    textShadowColor: colors.secondary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  },
                ]}
              >
                ✨ Dream Transcription
              </Text>

              {isTranscribing ? (
                <View style={styles.transcribing}>
                  <Text
                    style={[
                      styles.transcribingText,
                      {
                        color: colors.text,
                        textShadowColor: colors.primary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      },
                    ]}
                  >
                    🔮 Converting your sacred words to text...
                  </Text>
                </View>
              ) : (
                <View style={styles.transcribing}>
                  <Text
                    style={[
                      styles.dreamText,
                      {
                        color: colors.text,
                        textShadowColor: colors.secondary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 3,
                      },
                    ]}
                  >
                    {transcription}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* Playback Controls */}
        {audioUri && !isTranscribing && transcription && (
          <Animated.View
            style={[
              styles.playbackControls,
              {
                opacity: transcriptOpacity,
                transform: [{ translateY: transcriptTranslateY }],
              },
            ]}
          >
            <Button
              title="▶️ Replay Dream"
              onPress={playRecording}
              variant="primary"
              size="medium"
            />

            <Button
              title="🔄 Record Again"
              onPress={handleClearRecording}
              variant="secondary"
              ghost
              size="medium"
            />
          </Animated.View>
        )}

        {/* Error Display */}
        {error && (
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

      {/* Bottom Half - Sacred Recording Interface */}
      <View style={styles.bottomHalf}>
        {/* Recording Status */}
        <View style={styles.statusArea}>
          <Text
            style={[
              styles.status,
              {
                color: colors.primary,
                textShadowColor: colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 6,
              },
            ]}
          >
            {isRecording
              ? "Recording your sacred dream..."
              : isTranscribing
                ? "Converting speech to text..."
                : audioUri && transcription
                  ? "Dream transcription complete"
                  : "Touch the sacred geometry to begin"}
          </Text>

          {isRecording && (
            <Text
              style={[
                styles.hint,
                {
                  color: colors.text,
                  textShadowColor: colors.secondary,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Speak naturally. Breathe with the rhythm.
            </Text>
          )}

          {duration > 0 && !isRecording && !transcription && (
            <Text
              style={[
                styles.duration,
                {
                  color: colors.text,
                  textShadowColor: colors.secondary,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Recording duration: {duration} seconds
            </Text>
          )}
        </View>

        {/* Animated Sacred Recording Button - NO KEY PROP */}
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
  },
  duration: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  playbackControls: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  playButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
  dreamText: {
    fontSize: 16,
    lineHeight: 26,
  },
  errorContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderWidth: 1,
    borderColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    textShadowColor: "#F44336",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
