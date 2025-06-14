import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

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

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const breathingAnim = React.useRef(new Animated.Value(1)).current;

  // Sacred breathing animation while recording
  useEffect(() => {
    if (isRecording) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1.2,
            duration: 3000, // 3 second inhale
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 3000, // 3 second exhale
            useNativeDriver: true,
          }),
        ]),
      );
      breathingAnimation.start();
      return () => breathingAnimation.stop();
    } else {
      breathingAnim.setValue(1);
    }
  }, [isRecording]);

  // Pulse animation for transcribing
  useEffect(() => {
    if (isTranscribing) {
      const pulsingAnimation = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      pulsingAnimation.start();
      return () => pulsingAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTranscribing]);

  const getRecordingCircleColor = () => {
    if (isRecording) return colors.tint; // Purple when recording
    if (isTranscribing) return "#E5EB83"; // Gold when transcribing
    return colors.background === "#121212" ? "#2A2A2A" : "#F1F3F4"; // Surface color
  };

  return (
    <View style={styles.container}>
      {/* Sacred Recording Circle */}
      <View style={styles.recordingArea}>
        <Animated.View
          style={[
            styles.recordingCircle,
            {
              transform: [{ scale: isRecording ? breathingAnim : isTranscribing ? pulseAnim : 1 }],
              backgroundColor: getRecordingCircleColor(),
              borderColor: colors.tint,
              borderWidth: isRecording ? 3 : 1,
            },
          ]}
        >
          <Text style={styles.recordingIcon}>
            {isRecording ? "🎙️" : isTranscribing ? "🔮" : "🌙"}
          </Text>
        </Animated.View>

        {/* Recording Status */}
        <Text style={[styles.status, { color: colors.tint }]}>
          {isRecording
            ? "Recording your sacred dream..."
            : isTranscribing
              ? "Converting speech to text..."
              : audioUri
                ? "Dream captured successfully"
                : "Ready to record your dream"}
        </Text>

        {isRecording && (
          <Text style={[styles.hint, { color: colors.text }]}>
            Speak naturally. Duration: {Math.floor(Date.now() / 1000) % 60}s
          </Text>
        )}

        {duration > 0 && !isRecording && (
          <Text style={[styles.duration, { color: colors.text }]}>
            Recording duration: {duration} seconds
          </Text>
        )}
      </View>

      {/* Recording Controls */}
      <View style={styles.controls}>
        {!isRecording && !audioUri && (
          <TouchableOpacity
            style={[styles.recordButton, { backgroundColor: colors.tint }]}
            onPress={startRecording}
            activeOpacity={0.8}
          >
            <Text style={styles.recordButtonText}>🎙️ Begin Dream Recording</Text>
          </TouchableOpacity>
        )}

        {isRecording && (
          <TouchableOpacity style={[styles.stopButton]} onPress={stopRecording} activeOpacity={0.8}>
            <Text style={styles.stopButtonText}>⏹️ Complete Recording</Text>
          </TouchableOpacity>
        )}

        {audioUri && !isTranscribing && (
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: colors.tint }]}
              onPress={playRecording}
            >
              <Text style={styles.playButtonText}>▶️ Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.tint }]}
              onPress={clearRecording}
            >
              <Text style={[styles.clearButtonText, { color: colors.tint }]}>🔄 Record Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Transcription Display */}
      {(transcription || isTranscribing) && (
        <View
          style={[
            styles.transcriptionArea,
            { backgroundColor: colors.background === "#121212" ? "#1E1E1E" : "#F8F9FA" },
          ]}
        >
          <Text style={[styles.transcriptionTitle, { color: colors.tint }]}>
            ✨ Dream Transcription
          </Text>

          {isTranscribing ? (
            <View style={styles.transcribing}>
              <Text style={[styles.transcribingText, { color: colors.text }]}>
                🔮 Converting your sacred words to text...
              </Text>
            </View>
          ) : (
            <View style={styles.transcriptionText}>
              <Text style={[styles.dreamText, { color: colors.text }]}>{transcription}</Text>
            </View>
          )}
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  recordingArea: {
    alignItems: "center",
    marginVertical: 32,
  },
  recordingCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#8C6184",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  recordingIcon: {
    fontSize: 48,
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  duration: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  controls: {
    alignItems: "center",
    marginBottom: 24,
  },
  recordButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: width * 0.8,
    alignItems: "center",
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  stopButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F44336",
    minWidth: width * 0.6,
    alignItems: "center",
  },
  stopButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  playbackControls: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
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
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
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
  transcriptionText: {
    flex: 1,
  },
  dreamText: {
    fontSize: 16,
    lineHeight: 26,
  },
  errorContainer: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});
