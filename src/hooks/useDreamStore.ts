import { create } from "zustand";
import { DreamEntry, DreamRecording } from "@/types/dream";
import {
  detectDreamSigns,
  suggestRealityChecks,
  analyzeDreamClarity,
  detectLucidityLevel,
} from "@/utils/dreamAnalysis";

interface DreamStore {
  dreams: DreamEntry[];
  addDream: (recording: DreamRecording) => string;
  getDream: (id: string) => DreamEntry | undefined;
  updateDream: (id: string, updates: Partial<DreamEntry>) => void;
  deleteDream: (id: string) => void;
  getDreamsByDateRange: (startDate: Date, endDate: Date) => DreamEntry[];
  getRecentDreams: (count: number) => DreamEntry[];
}

export const useDreamStore = create<DreamStore>((set, get) => ({
  dreams: [],

  addDream: (recording: DreamRecording) => {
    const dreamSigns = detectDreamSigns(recording.transcription);
    const realityChecks = suggestRealityChecks(dreamSigns);
    const clarity = analyzeDreamClarity(recording.transcription);
    const lucidity = detectLucidityLevel(recording.transcription);

    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      title: generateDreamTitle(recording.transcription),
      recording,
      transcription: recording.transcription,
      dreamSigns,
      realityChecks,
      clarity,
      lucidity,
      emotions: [], // Could be enhanced with emotion detection
      recordedAt: recording.recordedAt,
      tags: dreamSigns, // Use dream signs as initial tags
    };

    set((state) => ({
      dreams: [newDream, ...state.dreams],
    }));

    return newDream.id;
  },

  getDream: (id: string) => {
    return get().dreams.find((dream) => dream.id === id);
  },

  updateDream: (id: string, updates: Partial<DreamEntry>) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => (dream.id === id ? { ...dream, ...updates } : dream)),
    }));
  },

  deleteDream: (id: string) => {
    set((state) => ({
      dreams: state.dreams.filter((dream) => dream.id !== id),
    }));
  },

  getDreamsByDateRange: (startDate: Date, endDate: Date) => {
    return get().dreams.filter((dream) => {
      const dreamDate = new Date(dream.recordedAt);
      return dreamDate >= startDate && dreamDate <= endDate;
    });
  },

  getRecentDreams: (count: number) => {
    return get().dreams.slice(0, count);
  },
}));

// Helper function to generate dream titles
const generateDreamTitle = (transcription: string): string => {
  const firstSentence = transcription.split(".")[0];
  if (firstSentence.length <= 50) {
    return firstSentence;
  }

  // Extract key elements for title
  const keyWords = ["flying", "water", "home", "school", "falling", "chase", "light"];
  const foundWords = keyWords.filter((word) => transcription.toLowerCase().includes(word));

  if (foundWords.length > 0) {
    return `Dream about ${foundWords[0]}`;
  }

  return firstSentence.substring(0, 47) + "...";
};
