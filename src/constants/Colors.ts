// Cosmic Deep Spiritual Color Palette
// Blending deep blues, electric blues, emeralds and violets/pinks

const tintColorLight = "#3B82F6";
const tintColorDark = "#00D4FF"; // Electric blue

export default {
  light: {
    text: "#1F2937",
    background: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,

    accent: "#00D4FF", // Electric cyan-blue
    primary: "#3359c5", // Cosmic blue
    secondary: "#8B5CF6", // Deep purple
    surface: "#F8FAFC",
    surfaceVariant: "#E2E8F0",

    // Additional usable colors
    brightBlue: "#3B82F6", // Bright blue
    aquaBlue: "#0891B2", // Aqua blue (darker for light theme)
    emerald: "#059669", // Emerald green (darker for light theme)
    jade: "#047857", // Deep jade (darker for light theme)
    violet: "#8B5CF6", // Violet
    purple: "#7C3AED", // Deep purple (darker for light theme)
    magenta: "#DB2777", // Electric pink (darker for light theme)
    rose: "#EC4899", // Soft pink
  },

  dark: {
    text: "#E5E7EB",
    background: "#0A0E1A", // Cosmic deep space
    tint: tintColorDark,
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,

    // Core cosmic palette using the blues
    accent: "#00D4FF", // Electric cyan-blue
    primary: "#3359c5", // Cosmic blue
    secondary: "#8B5CF6", // Deep purple

    surface: "#1A1D2E", // Deep cosmic surface
    surfaceVariant: "#252A3D", // Darker cosmic variant

    // Additional usable colors
    deepBlue: "#1E3A8A", // Navy cosmic blue
    brightBlue: "#3B82F6", // Bright blue
    aquaBlue: "#06B6D4", // Aqua blue
    emerald: "#10B981", // Emerald green
    jade: "#059669", // Deep jade
    violet: "#C084FC", // Bright violet
    purple: "#8B5CF6", // Deep purple
    magenta: "#EC4899", // Electric pink
    rose: "#F472B6", // Soft pink
  },
};
