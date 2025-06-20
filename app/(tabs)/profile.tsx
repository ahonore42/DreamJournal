import ProfileScreen from "@/components/screens/ProfileScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";

export default function TabTwoScreen() {
  return (
    <ScreenLayout scroll title="🌟 Sacred Profile" subtitle="Your spiritual journey dashboard">
      <ProfileScreen />
    </ScreenLayout>
  );
}
