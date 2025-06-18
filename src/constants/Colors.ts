// Global theme
export const theme = {
  // Core colors
  text: "#E5E7EB",
  background: "#0A0E1A", // Cosmic deep space
  surface: "#1A1D2E", // Deep cosmic surface
  surfaceVariant: "#252A3D", // Darker cosmic variant

  // Brand colors
  primary: "#3359c5", // Cosmic blue
  secondary: "#8B5CF6", // Deep purple
  accent: "#00D4FF", // Electric cyan-blue
  sacred: "#E5EB83", // Sacred gold

  // Extended palette
  deepBlue: "#1E3A8A",
  brightBlue: "#3B82F6",
  aquaBlue: "#06B6D4",
  emerald: "#10B981",
  jade: "#059669",
  violet: "#C084FC",
  magenta: "#EC4899",
  rose: "#F472B6",

  // Semantic colors
  white: "#FFFFFF",
  spaceBlack: "#000010",
  error: "#FF6B6B",
  errorDark: "#F44336",
  success: "#10B981",
  warning: "#F59E0B",

  // Text variants
  textSecondary: "#B3B3B3",
  textTertiary: "#9CA3AF",
  textMuted: "#6B7280",

  // Navigation
  tint: "#00D4FF",
  tabIconDefault: "#6B7280",
  tabIconSelected: "#00D4FF",

  // Overlays
  overlay: "rgba(0, 0, 0, 0.6)",
  surfaceOverlay: "rgba(139, 92, 246, 0.1)",
  borderOverlay: "rgba(139, 92, 246, 0.3)",
  accentOverlay: "rgba(0, 212, 255, 0.2)",
  errorOverlay: "rgba(244, 67, 54, 0.2)",

  // Shadows
  shadowPrimary: "#3359c5",
  shadowSecondary: "#8B5CF6",
  shadowAccent: "#00D4FF",
  shadowError: "#F44336",
  shadowWhite: "#FFFFFF",
} as const;
