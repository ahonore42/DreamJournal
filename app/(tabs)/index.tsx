import React from "react";
import { VoiceRecorder } from "@/components/screens/VoiceRecorder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";

export default function TabOneScreen() {
  return (
    <ScreenLayout title="Dream Journal" subtitle="Transcribe your dreams, grow lucid">
      <VoiceRecorder />
    </ScreenLayout>
  );
}
