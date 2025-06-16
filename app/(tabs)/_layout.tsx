import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { MenuButton } from "@/components/ui/MenuButton";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    // console.log('MenuButton pressed, current isMenuOpen:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
    // console.log('MenuButton pressed, new isMenuOpen:', !isMenuOpen);
  };

  const closeMenu = () => {
    // console.log('Closing menu');
    setIsMenuOpen(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Sacred Space",
            tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
            headerLeft: () => (
              <View style={{ marginLeft: 15 }}>
                <MenuButton onPress={toggleMenu} isMenuOpen={isMenuOpen} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: "Timeline",
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
            headerLeft: () => (
              <View style={{ marginLeft: 15 }}>
                <MenuButton onPress={toggleMenu} isMenuOpen={isMenuOpen} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ color }) => <TabBarIcon name="eye" color={color} />,
            headerLeft: () => (
              <View style={{ marginLeft: 15 }}>
                <MenuButton onPress={toggleMenu} isMenuOpen={isMenuOpen} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
            headerLeft: () => (
              <View style={{ marginLeft: 15 }}>
                <MenuButton onPress={toggleMenu} isMenuOpen={isMenuOpen} />
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Navigation Menu - positioned to slide below header */}
      <NavigationMenu isVisible={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
