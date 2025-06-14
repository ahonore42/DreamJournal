import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { VoiceRecorder } from "@/components/organisms/VoiceRecorder";

export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Voice Recording Interface - This is the primary feature */}
      <VoiceRecorder />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
