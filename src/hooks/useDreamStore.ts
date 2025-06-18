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
  addDreamFromVoice: (transcription: string, confidence: number, duration: number) => string;
  getDream: (id: string) => DreamEntry | undefined;
  updateDream: (id: string, updates: Partial<DreamEntry>) => void;
  deleteDream: (id: string) => void;
  getDreamsByDateRange: (startDate: Date, endDate: Date) => DreamEntry[];
  getRecentDreams: (count: number) => DreamEntry[];
  getTotalDreams: () => number;
  getAverageLucidity: () => number;
  getAverageClarity: () => number;
  getMostCommonDreamSigns: () => string[];
  getDreamsByTag: (tag: string) => DreamEntry[];
}

const detectEmotionsFromText = (transcription: string): string[] => {
  const emotionKeywords = {
    happy: [
      "happy",
      "joy",
      "excited",
      "wonderful",
      "amazing",
      "beautiful",
      "love",
      "glad",
      "pleased",
    ],
    scared: [
      "scared",
      "afraid",
      "frightened",
      "terror",
      "nightmare",
      "fear",
      "terrified",
      "horror",
    ],
    confused: ["confused", "lost", "strange", "weird", "bizarre", "odd", "puzzled", "disoriented"],
    peaceful: ["peaceful", "calm", "serene", "tranquil", "relaxed", "content", "zen"],
    anxious: ["anxious", "worried", "nervous", "stressed", "panic", "uneasy", "tense"],
    nostalgic: ["childhood", "past", "memory", "remember", "old", "nostalgia", "reminisce"],
    mysterious: ["mysterious", "unknown", "secret", "hidden", "magic", "mystical", "enigmatic"],
    sad: ["sad", "crying", "tears", "grief", "sorrow", "melancholy", "depressed"],
    angry: ["angry", "mad", "furious", "rage", "frustrated", "annoyed", "irritated"],
    surprised: ["surprised", "shocked", "amazed", "astonished", "startled", "unexpected"],
  };

  const detectedEmotions: string[] = [];
  const lowerText = transcription.toLowerCase();

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  });

  return detectedEmotions;
};

const getQualityTags = (confidence: number, clarity: number): string[] => {
  const tags: string[] = [];

  if (confidence >= 0.9) {
    tags.push("high-confidence");
  } else if (confidence >= 0.7) {
    tags.push("medium-confidence");
  } else if (confidence > 0) {
    tags.push("low-confidence");
  }

  if (clarity >= 8) {
    tags.push("very-vivid");
  } else if (clarity >= 6) {
    tags.push("vivid");
  } else if (clarity >= 4) {
    tags.push("moderate-detail");
  } else {
    tags.push("brief");
  }

  return tags;
};

const generateDreamTitle = (transcription: string): string => {
  const firstSentence = transcription.split(/[.!?]/)[0].trim();
  if (firstSentence.length <= 50 && firstSentence.length > 0) {
    return firstSentence;
  }

  const keyWords = [
    "flying",
    "water",
    "home",
    "school",
    "falling",
    "chase",
    "light",
    "family",
    "work",
    "car",
    "house",
    "ocean",
    "mountain",
    "forest",
    "city",
    "childhood",
    "friend",
    "animal",
    "fire",
    "bridge",
    "door",
    "mirror",
    "stairs",
    "phone",
    "computer",
  ];

  const lowerTranscription = transcription.toLowerCase();
  const foundWords = keyWords.filter((word) => lowerTranscription.includes(word));

  if (foundWords.length > 0) {
    const primaryWord = foundWords[0];
    return `Dream about ${primaryWord}`;
  }

  if (firstSentence.length > 50) {
    return firstSentence.substring(0, 47) + "...";
  }

  const words = transcription.split(" ").slice(0, 8).join(" ");
  return words.length > 50 ? words.substring(0, 47) + "..." : words || "Untitled Dream";
};

export const useDreamStore = create<DreamStore>((set, get) => ({
  dreams: [],

  addDream: (recording: DreamRecording) => {
    const dreamSigns = detectDreamSigns(recording.transcription);
    const realityChecks = suggestRealityChecks(dreamSigns);
    const clarity = analyzeDreamClarity(recording.transcription);
    const lucidity = detectLucidityLevel(recording.transcription);
    const emotions = detectEmotionsFromText(recording.transcription);

    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      title: generateDreamTitle(recording.transcription),
      recording,
      transcription: recording.transcription,
      dreamSigns,
      realityChecks,
      clarity,
      lucidity,
      emotions,
      recordedAt: recording.recordedAt,
      tags: [...dreamSigns, ...getQualityTags(recording.confidence, clarity)],
    };

    set((state) => ({
      dreams: [newDream, ...state.dreams],
    }));

    return newDream.id;
  },

  addDreamFromVoice: (transcription: string, confidence: number, duration: number) => {
    if (!transcription || transcription.trim().length === 0) {
      throw new Error("Cannot save empty dream transcription");
    }

    const dreamSigns = detectDreamSigns(transcription);
    const realityChecks = suggestRealityChecks(dreamSigns);
    const clarity = analyzeDreamClarity(transcription);
    const lucidity = detectLucidityLevel(transcription);
    const emotions = detectEmotionsFromText(transcription);

    const voiceRecording: DreamRecording = {
      id: `voice-recording-${Date.now()}`,
      audioUri: "",
      transcription,
      recordedAt: new Date(),
      duration,
      isTranscribing: false,
      confidence,
    };

    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      title: generateDreamTitle(transcription),
      recording: voiceRecording,
      transcription,
      dreamSigns,
      realityChecks,
      clarity,
      lucidity,
      emotions,
      recordedAt: new Date(),
      tags: [...dreamSigns, ...getQualityTags(confidence, clarity), ...emotions],
    };

    set((state) => ({
      dreams: [newDream, ...state.dreams],
    }));

    console.log(
      `✨ Dream saved: "${newDream.title}" with ${dreamSigns.length} dream signs and ${emotions.length} emotions`,
    );

    return newDream.id;
  },

  getDream: (id: string) => {
    return get().dreams.find((dream) => dream.id === id);
  },

  updateDream: (id: string, updates: Partial<DreamEntry>) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => {
        if (dream.id === id) {
          const updatedDream = { ...dream, ...updates };

          if (updates.transcription && updates.transcription !== dream.transcription) {
            const dreamSigns = detectDreamSigns(updates.transcription);
            const realityChecks = suggestRealityChecks(dreamSigns);
            const clarity = analyzeDreamClarity(updates.transcription);
            const lucidity = detectLucidityLevel(updates.transcription);
            const emotions = detectEmotionsFromText(updates.transcription);

            updatedDream.dreamSigns = dreamSigns;
            updatedDream.realityChecks = realityChecks;
            updatedDream.clarity = clarity;
            updatedDream.lucidity = lucidity;
            updatedDream.emotions = emotions;
            updatedDream.tags = [...dreamSigns, ...emotions];
            updatedDream.title = generateDreamTitle(updates.transcription);
          }

          return updatedDream;
        }
        return dream;
      }),
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

  getTotalDreams: () => {
    return get().dreams.length;
  },

  getAverageLucidity: () => {
    const dreams = get().dreams;
    if (dreams.length === 0) return 0;

    const totalLucidity = dreams.reduce((sum, dream) => sum + dream.lucidity, 0);
    return Math.round((totalLucidity / dreams.length) * 10) / 10;
  },

  getAverageClarity: () => {
    const dreams = get().dreams;
    if (dreams.length === 0) return 0;

    const totalClarity = dreams.reduce((sum, dream) => sum + dream.clarity, 0);
    return Math.round((totalClarity / dreams.length) * 10) / 10;
  },

  getMostCommonDreamSigns: () => {
    const dreams = get().dreams;
    const signCounts: { [key: string]: number } = {};

    dreams.forEach((dream) => {
      dream.dreamSigns.forEach((sign) => {
        signCounts[sign] = (signCounts[sign] || 0) + 1;
      });
    });

    return Object.entries(signCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([sign]) => sign);
  },

  getDreamsByTag: (tag: string) => {
    return get().dreams.filter(
      (dream) =>
        dream.tags.includes(tag) || dream.dreamSigns.includes(tag) || dream.emotions.includes(tag),
    );
  },
}));
