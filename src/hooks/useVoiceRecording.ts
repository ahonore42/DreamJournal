import { useState, useEffect } from "react";
import { useAudioRecorder, useAudioPlayer, RecordingPresets, AudioModule } from "expo-audio";
import * as FileSystem from "expo-file-system";

export interface VoiceRecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  audioUri: string | null;
  transcription: string;
  duration: number;
  error: string | null;
  hasPermission: boolean;
}

export const useVoiceRecording = () => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    audioUri: null,
    transcription: "",
    duration: 0,
    error: null,
    hasPermission: false,
  });

  // Use the expo-audio hooks
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const audioPlayer = useAudioPlayer(state.audioUri);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        setState((prev) => ({ ...prev, hasPermission: granted }));

        if (!granted) {
          setState((prev) => ({
            ...prev,
            error: "Microphone permission required for dream recording",
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to request microphone permission",
        }));
      }
    };

    requestPermissions();
  }, []);

  const startRecording = async () => {
    try {
      if (!state.hasPermission) {
        throw new Error("Microphone permission required for dream recording");
      }

      console.log("🎙️ Starting sacred dream recording...");

      setState((prev) => ({ ...prev, isRecording: true, error: null }));

      // Prepare and start recording using expo-audio API
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error("Failed to start recording:", error);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error: error instanceof Error ? error.message : "Failed to start recording",
      }));
    }
  };

  const stopRecording = async () => {
    try {
      console.log("⏹️ Stopping dream recording...");

      // Stop recording - the URI will be available on audioRecorder.uri
      await audioRecorder.stop();

      const uri = audioRecorder.uri;

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isTranscribing: true,
        audioUri: uri,
      }));

      // Start transcription process
      if (uri) {
        await getTranscription(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to stop recording",
        isRecording: false,
        isTranscribing: false,
      }));
    }
  };

  const getTranscription = async (audioUri: string) => {
    try {
      console.log("🔮 Transcribing dream audio...");

      // Get file info
      const info = await FileSystem.getInfoAsync(audioUri);
      console.log(`Audio file info:`, info);

      // For development, use mock transcription
      const transcription = await mockTranscription();

      setState((prev) => ({
        ...prev,
        isTranscribing: false,
        transcription,
      }));

      // TODO: In production, implement real speech-to-text
      // Send to Google Cloud Function for transcription
    } catch (error) {
      console.error("Transcription failed:", error);
      setState((prev) => ({
        ...prev,
        isTranscribing: false,
        transcription: "Transcription failed. Please try recording again.",
      }));
    }
  };

  const playRecording = async () => {
    try {
      if (!state.audioUri) return;

      console.log("▶️ Playing dream recording...");
      audioPlayer.play();
    } catch (error) {
      console.error("Failed to play recording:", error);
    }
  };

  const clearRecording = async () => {
    // Clean up audio file if it exists
    if (state.audioUri) {
      try {
        await FileSystem.deleteAsync(state.audioUri, { idempotent: true });
      } catch (error) {
        console.log("Could not delete audio file:", error);
      }
    }

    setState((prev) => ({
      ...prev,
      isRecording: false,
      isTranscribing: false,
      audioUri: null,
      transcription: "",
      duration: 0,
      error: null,
    }));
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
    // Expose recorder state for UI
    isRecordingActive: audioRecorder.isRecording,
  };
};
// Mock transcription for development
const mockTranscription = async (): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const dreamTranscriptions = [
    "I was flying through a crystal cave filled with purple light. Ancient symbols on the walls pulsed with mystical energy, and I could hear distant chanting that felt both familiar and otherworldly. The walls seemed to breathe with life.",

    "I found myself in my childhood home, but all the rooms were different. The hallway stretched infinitely, and I could hear my grandmother calling my name from somewhere unreachable. The furniture was floating slightly off the ground.",

    "I was standing on a bridge made of pure starlight, looking down at an ocean of liquid moonlight. Fish made of pure energy swam beneath the surface, and somehow I knew I could breathe underwater if I chose to jump.",

    "My teeth began falling out one by one, but instead of pain, each tooth transformed into a glowing orb that floated around my head like a crown of light. I felt a strange sense of renewal rather than loss.",

    "I was late for an important exam, but when I reached the classroom, all the desks were floating in mid-air and the professor was a wise owl speaking in ancient riddles. The chalkboard showed equations that shifted into poetry.",

    "I walked through a forest where the trees had eyes and whispered secrets about the future. The path led to a clearing with a crystal fountain that showed visions of possible timelines, each ripple revealing different life paths.",

    "I was in a library with infinite floors, where books flew like birds between the shelves. I was searching for a specific book that contained the meaning of existence, but the words kept changing as I read them, adapting to my thoughts.",

    "I realized I was dreaming when I looked at my hands and saw six fingers. This awareness allowed me to consciously reshape the dreamscape, turning the gray city around me into a vibrant garden filled with impossible flowers.",

    "I was swimming through clouds that felt like warm silk. Below me, I could see my physical body sleeping in bed, and I understood I was experiencing some form of astral projection. The sensation was both exhilarating and peaceful.",
  ];

  return dreamTranscriptions[Math.floor(Math.random() * dreamTranscriptions.length)];
};
