// Global Styles for DreamJournal patterns, refactored for simplicity and reusability.

import { StyleSheet, ViewStyle, TextStyle, ShadowStyleIOS } from "react-native";
import { theme } from "./Colors";

// ==================================
// STYLE FACTORY FUNCTIONS
// These helpers generate styles based on passed options, reducing boilerplate.
// ==================================

/**
 * Converts a hex color string to an rgba string.
 * @param {string} hex - The hex color code (e.g., "#RRGGBB").
 * @param {number} opacity - The opacity value (0 to 1).
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Creates a surface style with configurable padding, radius, and colors.
 */
export const createSurface = ({
  padding = 24,
  borderRadius = 16,
  backgroundColor = theme.surfaceOverlay,
  borderColor = theme.borderOverlay,
  borderWidth = 1,
}: {
  padding?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}): ViewStyle => ({
  backgroundColor,
  borderRadius,
  padding,
  borderWidth,
  borderColor,
});

export const createTranscriptionArea = (
  minHeight: number = 200,
  padding: number = 16,
): ViewStyle => ({
  flex: 1,
  padding,
  marginBottom: 16,
  minHeight,
  alignSelf: "flex-start",
});

export const createAvatar = (
  size: number = 50,
  backgroundColor: string = "rgba(139, 92, 246, 0.2)",
  borderColor: string = "#8B5CF6",
  borderWidth: number = 2,
): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor,
  borderWidth,
  borderColor,
  justifyContent: "center",
  alignItems: "center",
});

export const createMenuItem = (
  borderColor: string = theme.primary,
  backgroundColor: string = "transparent",
): ViewStyle => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderLeftWidth: 3,
  borderLeftColor: borderColor,
  backgroundColor,
  marginVertical: 2,
});

export const createCardSurface = (
  opacity: number = 0.1,
  borderOpacity: number = 0.3,
  borderRadius: number = 16,
  padding: number = 24,
): ViewStyle => ({
  backgroundColor: `rgba(139, 92, 246, ${opacity})`,
  borderRadius,
  padding,
  borderWidth: 1,
  borderColor: `rgba(139, 92, 246, ${borderOpacity})`,
});

export const createOverlay = (
  backgroundColor: string = "rgba(0, 0, 0, 0.9)",
  borderColor: string = theme.accent,
  borderWidth: number = 2,
  borderRadius: number = 12,
  padding: number = 16,
): ViewStyle => ({
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  padding,
});

/**
 * Creates a shadow style for views.
 */
export const createShadow = ({
  color,
  opacity = 0.3,
  radius = 8,
  elevation = 8,
  offset = { width: 0, height: 4 },
}: {
  color: string;
  opacity?: number;
  radius?: number;
  elevation?: number;
  offset?: ShadowStyleIOS["shadowOffset"];
}): ViewStyle => ({
  shadowColor: color,
  shadowOffset: offset,
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

/**
 * Creates a text glow effect using textShadow.
 */
export const createTextGlow = (color: string, radius: number): TextStyle => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: radius,
});

// ==================================
// REFACTORED GLOBAL STYLES (USING YOUR THEME)
// ==================================

// CONTAINER STYLES (STATIC)
export const containers = StyleSheet.create({
  flex: { flex: 1 } as ViewStyle,
  centered: { alignItems: "center", justifyContent: "center" } as ViewStyle,
  fullScreen: { flex: 1, alignItems: "center", justifyContent: "center" } as ViewStyle,
  splitTop: { flex: 1, minHeight: 0 } as ViewStyle,
  splitBottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  } as ViewStyle,
});

// CONTAINER STYLE HELPERS (DYNAMIC)
export const createContentContainerStyle = (
  centered = false,
  paddingHorizontal = 16,
  paddingVertical = 8,
): ViewStyle => ({
  flex: 1,
  paddingHorizontal,
  paddingVertical,
  ...(centered && { justifyContent: "center", alignItems: "center" }),
});

export const createScrollContentStyle = (extraTopPadding = 0): ViewStyle => ({
  padding: 24,
  paddingTop: 24 + extraTopPadding,
});

// SURFACES
export const surfaces = StyleSheet.create({
  card: createSurface({ padding: 24, borderRadius: 16 }),
  cardSmall: createSurface({ padding: 16, borderRadius: 12 }),
  transcriptionArea: createSurface({ padding: 20, borderRadius: 12 }),
  error: createSurface({
    backgroundColor: theme.errorOverlay,
    borderColor: theme.errorDark,
    padding: 12,
    borderRadius: 8,
  }),
  overlay: createSurface({
    backgroundColor: theme.overlay,
    borderColor: theme.accent,
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
  }),
});

// TEXT EFFECTS
export const textEffects = StyleSheet.create({
  primaryGlow: createTextGlow(theme.primary, 6),
  secondaryGlow: createTextGlow(theme.secondary, 8),
  accentGlow: createTextGlow(theme.accent, 6),
  subtleGlow: createTextGlow(theme.secondary, 2),
  errorGlow: createTextGlow(theme.error, 6),
  sacredGlow: createTextGlow(theme.sacred, 8),
});

// SHADOWS & ELEVATIONS
export const shadows = StyleSheet.create({
  primary: createShadow({ color: theme.shadowPrimary, elevation: 8 }),
  secondary: createShadow({
    color: theme.shadowSecondary,
    offset: { width: 0, height: 2 },
    radius: 6,
    elevation: 6,
  }),
  accent: createShadow({
    color: theme.shadowAccent,
    offset: { width: 0, height: 6 },
    opacity: 0.4,
    radius: 12,
    elevation: 12,
  }),
  sacred: createShadow({ color: theme.shadowSecondary, opacity: 0.5, radius: 12, elevation: 12 }),
  menu: createShadow({
    color: theme.shadowSecondary,
    offset: { width: 2, height: 0 },
    radius: 12,
    elevation: 20,
  }),
  error: createShadow({ color: theme.shadowError, elevation: 8 }),
});

// BUTTONS
export const buttons = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    overflow: "hidden",
    position: "relative",
  } as ViewStyle,
  small: { paddingHorizontal: 16, paddingVertical: 8 } as ViewStyle,
  medium: { paddingHorizontal: 24, paddingVertical: 12 } as ViewStyle,
  large: { paddingHorizontal: 32, paddingVertical: 16 } as ViewStyle,
  touchArea: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  sacred: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  } as ViewStyle,
});

// LAYOUTS (STATIC)
export const layouts = StyleSheet.create({
  userInfo: {
    ...createSurface({ padding: 24, borderRadius: 16 }),
    alignItems: "center",
    marginBottom: 48,
  } as ViewStyle,
  userSection: { flexDirection: "row", alignItems: "center", flex: 1 } as ViewStyle,
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.surfaceOverlay,
    borderWidth: 2,
    borderColor: theme.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  } as ViewStyle,
  bottomSection: {
    alignItems: "center",
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: theme.borderOverlay,
  } as ViewStyle,
  statusArea: { alignItems: "center", marginBottom: 32, paddingHorizontal: 20 } as ViewStyle,
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    marginVertical: 2,
  } as ViewStyle,
  menuItemContent: { flexDirection: "row", alignItems: "center", flex: 1 } as ViewStyle,
  actions: {
    width: "100%",

    gap: 16,
  } as ViewStyle,
  actionsWithMargin: {
    gap: 16,
    marginBottom: 48,
  } as ViewStyle,
});

// LAYOUT STYLE HELPERS (DYNAMIC)
export const createHeaderStyle = (withPadding = false): ViewStyle => ({
  alignItems: "center",
  marginBottom: 48,
  ...(withPadding && { paddingTop: 20 }),
});

export const createActionsStyle = (withMargin = false): ViewStyle => ({
  width: "100%",
  gap: 16,
  ...(withMargin && { marginBottom: 48 }),
});

// TYPOGRAPHY STYLES
export const typography = StyleSheet.create({
  base: { color: theme.text, letterSpacing: 0.5 } as TextStyle,
  title: { color: theme.text, fontSize: 42, fontWeight: "bold", marginBottom: 8 } as TextStyle,
  subtitle: { color: theme.text, fontSize: 18, opacity: 0.9 } as TextStyle,
  status: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  } as TextStyle,
  hint: {
    color: theme.text,
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
    letterSpacing: 0.3,
    marginBottom: 8,
  } as TextStyle,
  duration: {
    color: theme.text,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
  } as TextStyle,
  transcriptionTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  } as TextStyle,
  transcriptionText: {
    color: theme.white,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "left",
  } as TextStyle,
  partialText: {
    color: theme.text,
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "500",
  } as TextStyle,
  confidenceText: {
    fontSize: 14,
    textAlign: "center",
    color: theme.textTertiary,
    opacity: 0.8,
    marginBottom: 32,
    fontStyle: "italic",
  } as TextStyle,
  menuItemText: { color: theme.text, fontSize: 16, flex: 1 } as TextStyle,
  footerText: { color: theme.secondary, marginBottom: 4 } as TextStyle,
  footerSubtext: { color: theme.textSecondary, opacity: 0.7, fontSize: 12 } as TextStyle,
  errorText: { color: theme.error, fontStyle: "italic" } as TextStyle,
});

// OVERLAYS & MODALS
export const overlays = StyleSheet.create({
  full: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 } as ViewStyle,
  touch: { flex: 1 } as ViewStyle,
  partial: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.accent, // Added borderColor to match original intent
    ...createShadow({ color: theme.shadowAccent, offset: { width: 0, height: 2 }, elevation: 5 }),
  } as ViewStyle,
  menuPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.background,
    borderRightWidth: 1,
    borderRightColor: theme.borderOverlay,
    ...shadows.menu,
  } as ViewStyle,
});

// DIVIDERS & SEPARATORS
export const dividers = StyleSheet.create({
  standard: {
    height: 1,
    backgroundColor: theme.borderOverlay,
    marginVertical: 12,
    marginHorizontal: 20,
  } as ViewStyle,
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: theme.borderOverlay,
  } as ViewStyle,
  border: { borderTopWidth: 1, borderTopColor: theme.borderOverlay } as ViewStyle,
});

// ICONS & VISUAL ELEMENTS
export const icons = StyleSheet.create({
  menu: { marginRight: 16, width: 24, textAlign: "center" } as TextStyle,
  chevron: { opacity: 0.5 } as TextStyle,
  avatarText: { fontSize: 20, color: theme.text } as TextStyle,
});

// UTILITY STYLES
export const utils = StyleSheet.create({
  disabled: { opacity: 0.5 } as ViewStyle,
  hidden: { opacity: 0 } as ViewStyle,
  visible: { opacity: 1 } as ViewStyle,
  pointerEventsNone: { pointerEvents: "none" } as ViewStyle,
  pointerEventsAuto: { pointerEvents: "auto" } as ViewStyle,
  absoluteFill: StyleSheet.absoluteFillObject,
  zIndexLow: { zIndex: 1 } as ViewStyle,
  zIndexMedium: { zIndex: 100 } as ViewStyle,
  zIndexHigh: { zIndex: 1000 } as ViewStyle,
});
