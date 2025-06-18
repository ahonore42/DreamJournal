import { Text as DefaultText, View as DefaultView } from "react-native";
import { theme } from "@/constants/Colors";
type ThemeProps = {
  backgroundColor?: string; // Optional explicit background color
};
export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
/**

Themed Text component using unified dark theme
*/
export function Text(props: TextProps) {
  const { style, backgroundColor, ...otherProps } = props;

  return (
    <DefaultText
      style={[
        { color: theme.text }, // Always use theme text color
        style,
      ]}
      {...otherProps}
    />
  );
}
/**

Themed View component with optional background
By default, no background is applied (transparent)
Use backgroundColor prop to explicitly set a background
*/
export function View(props: ViewProps) {
  const { style, backgroundColor, ...otherProps } = props;

  const backgroundStyle = backgroundColor ? { backgroundColor } : {};
  return <DefaultView style={[backgroundStyle, style]} {...otherProps} />;
}
/**

Utility function to get theme colors
Use this if you need to access theme colors programmatically
*/
export function getThemeColor(colorName: keyof typeof theme) {
  return theme[colorName];
}

/**

Pre-styled View variants for common use cases
*/
export function BackgroundView(props: ViewProps) {
  return <View {...props} backgroundColor={theme.background} />;
}

export function SurfaceView(props: ViewProps) {
  return <View {...props} backgroundColor={theme.surface} />;
}
export function SurfaceVariantView(props: ViewProps) {
  return <View {...props} backgroundColor={theme.surfaceVariant} />;
}
