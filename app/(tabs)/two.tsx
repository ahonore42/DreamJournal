import { StyleSheet } from "react-native";
import EditScreenInfo from "@/components/ui/EditScreenInfo";
import { Text, View } from "@/components/layout/Themed";
import StarryBackground from "@/components/layout/StarryBackground";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <StarryBackground>
        <Text style={styles.title}>🌌 Dream Timeline</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/two.tsx" />
      </StarryBackground>
    </View>
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
