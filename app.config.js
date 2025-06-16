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
      // You can keep the image or remove it if you want a purely dark screen
      // image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#00001a",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
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
