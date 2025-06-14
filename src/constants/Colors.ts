// Simple dream-inspired theme with dark backgrounds and luminescent blues/purples

const tintColorLight = "#6366F1"; // Luminescent indigo
const tintColorDark = "#8B5CF6"; // Glowing purple

export default {
  light: {
    text: "#1F2937",
    background: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,

    // Dream-inspired colors
    primary: "#6366F1", // Luminescent indigo
    secondary: "#3B82F6", // Electric blue
    accent: "#8B5CF6", // Glowing purple
    surface: "#F8FAFC",
    surfaceVariant: "#E2E8F0",
  },

  dark: {
    text: "#E5E7EB",
    background: "#0F0F23", // Deep space black
    tint: tintColorDark,
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,

    // Luminescent dream colors
    primary: "#8B5CF6", // Glowing violet
    secondary: "#3B82F6", // Electric blue
    accent: "#06B6D4", // Cyan glow
    surface: "#1A1B2E", // Dark surface
    surfaceVariant: "#16213E", // Darker variant
  },
};
