import React, { useEffect, useCallback, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import "react-native-reanimated";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/constants/Colors";
import ShootingStarSplashScreen from "@/components/screens/ShootingStarSplashScreen";
import WelcomeScreen from "./auth/welcome";

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

// Create navigation theme by properly extending DarkTheme with your theme
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...theme,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // This state will control the switch from our custom splash to the main app.
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  // Get authentication state
  const { isAuthenticated, isLoading, initializeAuth } = useAuth();

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Initialize auth state when the app starts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // This callback hides the native splash screen as soon as the root view is laid out.
  // This reveals our custom splash animation (<ShootingStarSplashScreen />).
  const onLayout = useCallback(async () => {
    // We only need to hide the splash screen once.
    if (!isSplashAnimationComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isSplashAnimationComplete]);

  // This effect starts a timer once fonts are loaded. After the timer,
  // we switch from the splash animation to the next screen (auth check).
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
    <ThemeProvider value={AppTheme}>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {/* 
          Authentication Flow:
          1. Show splash while fonts are loading or splash animation is playing
          2. Show splash/loading while checking authentication state
          3. Show welcome screen if not authenticated
          4. Show main app if authenticated
        */}
        {!fontsLoaded || !isSplashAnimationComplete ? (
          <ShootingStarSplashScreen />
        ) : isLoading ? (
          <ShootingStarSplashScreen />
        ) : !isAuthenticated ? (
          <WelcomeScreen />
        ) : (
          <RootLayoutNav />
        )}
      </View>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
