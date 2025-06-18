export default {
  expo: {
    name: "DreamJournal",
    slug: "dreamjournal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "dreamjournal",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      backgroundColor: "#00001a",
      resizeMode: "contain",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dreamjournal.app",
      infoPlist: {
        NSSpeechRecognitionUsageDescription:
          "This app uses speech recognition to transcribe your dreams into text for your sacred journal.",
        NSMicrophoneUsageDescription:
          "This app needs access to your microphone to record your dream narrations.",
        NSSpeechRecognitionUsageDescription:
          "DreamJournal uses speech recognition to convert your spoken dreams into text, making it easier to capture your sacred visions the moment you wake up.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#00001a",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
      package: "com.dreamjournal.app",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "@react-native-voice/voice"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
    owner: "ahonore42",
  },
};
