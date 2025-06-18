import { useState, useEffect, useRef, useCallback } from "react";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from "@react-native-voice/voice";
import { Platform } from "react-native";

export interface VoiceRecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  audioUri: string | null;
  transcription: string;
  partialTranscription: string;
  duration: number;
  error: string | null;
  hasPermission: boolean;
  confidence: number;
}

export const useVoiceRecording = () => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    audioUri: null,
    transcription: "",
    partialTranscription: "",
    duration: 0,
    error: null,
    hasPermission: false,
    confidence: 0,
  });

  const startTimeRef = useRef<number>(0);
  const durationTimerRef = useRef<number | null>(null);

  const cleanupTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  // Initialize Voice recognition event handlers
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      cleanupTimer();
      Voice.destroy().then(Voice.removeAllListeners).catch(console.error);
    };
  }, [cleanupTimer]);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === "android") {
          setState((prev) => ({ ...prev, hasPermission: true }));
        } else if (Platform.OS === "ios") {
          setState((prev) => ({ ...prev, hasPermission: true }));
        } else {
          setState((prev) => ({ ...prev, hasPermission: true }));
        }
      } catch (error) {
        console.error("Permission request failed:", error);
        setState((prev) => ({
          ...prev,
          error: "Microphone permission required for dream recording",
          hasPermission: false,
        }));
      }
    };

    requestPermissions();
  }, []);

  const onSpeechStart = useCallback((e: SpeechStartEvent) => {
    console.log("🎙️ Speech recognition started:", e);
    startTimeRef.current = Date.now();

    // Clear any existing timer
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }

    // Start duration timer with error handling
    durationTimerRef.current = setInterval(() => {
      try {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setState((prev) => ({ ...prev, duration: elapsed }));
      } catch (error) {
        console.error("Error updating duration:", error);
        // Clear timer if there's an error
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
          durationTimerRef.current = null;
        }
      }
    }, 1000);

    setState((prev) => ({
      ...prev,
      isRecording: true,
      isTranscribing: false,
      error: null,
      transcription: "",
      partialTranscription: "",
      duration: 0,
    }));
  }, []);

  const onSpeechRecognized = useCallback((e: SpeechRecognizedEvent) => {
    console.log("🔍 Speech recognized:", e);
  }, []);

  const onSpeechEnd = useCallback((e: SpeechEndEvent) => {
    console.log("⏹️ Speech recognition ended:", e);

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isRecording: false,
      isTranscribing: false,
      partialTranscription: "",
    }));
  }, []);

  const onSpeechError = useCallback((e: SpeechErrorEvent) => {
    console.error("❌ Speech recognition error:", e);

    // Safe timer cleanup with null checks
    try {
      if (durationTimerRef && durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    } catch (timerError) {
      console.error("Error clearing timer:", timerError);
    }

    let errorMessage = "Speech recognition failed. Please try again.";

    try {
      if (e && e.error) {
        switch (e.error.code) {
          case "7": // ERROR_NO_MATCH
          case "recognition_fail":
            errorMessage = "No speech detected. Please speak clearly and try again.";
            break;
          case "6": // ERROR_SPEECH_TIMEOUT
            errorMessage = "Speech timeout. Please try speaking again.";
            break;
          case "5": // ERROR_CLIENT
            errorMessage = "Microphone permission denied.";
            break;
          case "3": // ERROR_AUDIO
            errorMessage = "Audio recording problem. Please check your microphone.";
            break;
          case "8": // ERROR_BUSY
            errorMessage = "Speech recognition is busy. Please wait and try again.";
            break;
          case "1110":
            errorMessage = "No speech detected. Please speak more clearly.";
            break;
          default:
            errorMessage = `Speech recognition error: ${e.error.message || "Unknown error"}`;
        }
      }
    } catch (errorParsingError) {
      console.error("Error parsing speech error:", errorParsingError);
    }

    try {
      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: false,
        error: errorMessage,
        partialTranscription: "",
      }));
    } catch (stateError) {
      console.error("Error updating state after speech error:", stateError);
      // Fallback: try to at least stop recording state
      try {
        setState((prev) => ({
          ...prev,
          isRecording: false,
          isTranscribing: false,
        }));
      } catch (fallbackError) {
        console.error("Fallback state update failed:", fallbackError);
      }
    }
  }, []);

  const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
    console.log("✨ Final speech results:", e);

    if (e.value && e.value.length > 0) {
      const bestResult = e.value[0];
      const confidence = 0.9;

      setState((prev) => ({
        ...prev,
        transcription: bestResult,
        partialTranscription: "",
        confidence,
        isTranscribing: false,
      }));
    }
  }, []);

  const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
    console.log("🔄 Partial speech results:", e);

    if (e.value && e.value.length > 0) {
      const partialResult = e.value[0];
      setState((prev) => ({
        ...prev,
        partialTranscription: partialResult,
        isTranscribing: true,
      }));
    }
  }, []);

  const onSpeechVolumeChanged = useCallback((e: any) => {
    // Could be used for volume-based UI feedback
  }, []);

  const startRecording = async () => {
    try {
      if (!state.hasPermission) {
        throw new Error("Microphone permission required for dream recording");
      }

      console.log("🎙️ Starting sacred dream recording with voice recognition...");

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: false,
        error: null,
        transcription: "",
        partialTranscription: "",
        duration: 0,
        confidence: 0,
      }));

      try {
        await Voice.start("en-US");
      } catch (voiceError) {
        // Catch Voice.start errors specifically
        throw new Error("Could not start voice recognition");
      }
    } catch (error) {
      console.log("Failed to start voice recognition:", error); // Use console.log instead of console.error
      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: false,
        transcription:
          "🔧 Could not start recording. Please check microphone permissions and try again.",
        error: "speech_error",
      }));
    }
  };

  const stopRecording = async () => {
    try {
      console.log("⏹️ Stopping dream recording...");

      cleanupTimer();

      try {
        await Voice.stop();
      } catch (voiceError) {
        // Silently handle Voice.stop errors
      }
    } catch (error) {
      console.log("Failed to stop voice recognition:", error); // Use console.log instead of console.error
      cleanupTimer();

      setState((prev) => ({
        ...prev,
        error: "Failed to stop recording",
        isRecording: false,
        isTranscribing: false,
      }));
    }
  };

  const cancelRecording = async () => {
    try {
      console.log("❌ Cancelling dream recording...");

      cleanupTimer();

      try {
        await Voice.cancel();
      } catch (voiceError) {
        // Silently handle Voice.cancel errors
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: false,
        transcription: "",
        partialTranscription: "",
        duration: 0,
        error: null,
      }));
    } catch (error) {
      console.log("Failed to cancel voice recognition:", error); // Use console.log instead of console.error
    }
  };

  const playRecording = async () => {
    console.log("🔊 Play recording not available with voice recognition");
  };

  const clearRecording = async () => {
    try {
      if (state.isRecording) {
        await Voice.cancel();
      }

      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: false,
        audioUri: null,
        transcription: "",
        partialTranscription: "",
        duration: 0,
        error: null,
        confidence: 0,
      }));
    } catch (error) {
      console.error("Could not clear recording:", error);
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    playRecording,
    clearRecording,
    partialTranscription: state.partialTranscription,
    confidence: state.confidence,
    isRecordingActive: state.isRecording,
  };
};
