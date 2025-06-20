import { StyleSheet } from "react-native";
import EditScreenInfo from "@/components/ui/EditScreenInfo";
import { View } from "@/components/layout/Themed";
import { ScreenLayout } from "@/components/layout/ScreenLayout";

export default function TabTwoScreen() {
  return (
    <ScreenLayout scroll title="🌌 Dream Timeline" subtitle="Track your dreams">
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
