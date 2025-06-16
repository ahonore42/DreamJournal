import React, { useEffect, useCallback, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import ShootingStarSplashScreen from "@/components/ShootingStarSplashScreen";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // This state will control the switch from our custom splash to the main app.
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // This callback hides the native splash screen as soon as the root view is laid out.
  // This reveals our custom splash animation (<ShootingStarSplashScreen />).
  const onLayout = useCallback(async () => {
    // We only need to hide the splash screen once.
    // The conditional check here is not strictly necessary but adds robustness.
    if (!isSplashAnimationComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isSplashAnimationComplete]);

  // This effect starts a timer once fonts are loaded. After the timer,
  // we switch from the splash animation to the main app content.
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setSplashAnimationComplete(true);
      }, 2500); // Duration for the splash animation
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  // The root View is always rendered. `onLayout` will fire once, hiding the native splash.
  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {/* We show the splash animation until BOTH fonts are loaded AND the animation timer is complete.
        This ensures the splash is visible for a minimum duration and doesn't disappear before fonts are ready.
      */}
      {!fontsLoaded || !isSplashAnimationComplete ? (
        <ShootingStarSplashScreen />
      ) : (
        <RootLayoutNav />
      )}
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
