import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "react-native";
import { createTranscriptionArea, surfaces, typography } from "@/constants/GlobalStyles";
import { GlowText } from "./GlowText";

interface TranscriptionAreaProps {
  title?: string;
  content: string;
  isTranscribing?: boolean;
  isError?: boolean;
  style?: ViewStyle;
}
export const TranscriptionArea: React.FC<TranscriptionAreaProps> = ({
  title = "✨ Dream Transcription",
  content,
  isTranscribing = false,
  isError = false,
  style,
}) => {
  return (
    <View style={[createTranscriptionArea(), style]}>
      <GlowText variant="secondary" textStyle="transcriptionTitle">
        {title}
      </GlowText>
      {isTranscribing ? (
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <GlowText variant="primary">🔮 Converting your sacred words to text...</GlowText>
        </View>
      ) : (
        <View style={surfaces.transcriptionArea}>
          <Text style={[typography.transcriptionText, isError && typography.errorText]}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};
