export interface DreamRecording {
  id: string;
  audioUri: string;
  transcription: string;
  recordedAt: Date;
  duration: number;
  isTranscribing: boolean;
  confidence: number;
}

export interface DreamEntry {
  id: string;
  title: string;
  recording: DreamRecording;
  transcription: string;
  editedTranscription?: string;
  dreamSigns: string[]; // For lucid dreaming pattern detection
  realityChecks: string[]; // Suggested practices for lucidity
  clarity: number; // 1-10 dream vividness rating
  lucidity: number; // 0-10 awareness level during dream
  emotions: string[]; // Detected emotions from speech
  recordedAt: Date;
  tags: string[];
}

export type DreamMood = "peaceful" | "mysterious" | "vivid" | "confused" | "enlightening" | "lucid";
