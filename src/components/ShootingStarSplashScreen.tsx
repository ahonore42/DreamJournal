import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import StarryBackground from "./layout/StarryBackground";

const { width, height } = Dimensions.get("window");

const ShootingStarSplashScreen: React.FC = () => {
  // --- Animation State for the Shooting Star ---
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const tailLength = useRef(new Animated.Value(0)).current;

  // --- Animation Logic for the Shooting Star ---
  useEffect(() => {
    const animateShootingStar = () => {
      const startX = -200;
      const startY = Math.random() * height;
      const endX = width + 200;

      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(1);
      tailLength.setValue(0);

      Animated.parallel([
        Animated.timing(tailLength, {
          toValue: 200,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false, // cannot be native-driven
        }),
        Animated.timing(translateX, {
          toValue: endX,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          opacity.setValue(0);
          // Restart the animation after a random delay
          setTimeout(animateShootingStar, Math.random() * 5000 + 2000);
        }
      });
    };

    // Start the first animation after a brief delay
    const timeoutId = setTimeout(animateShootingStar, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <StarryBackground>
      <Animated.View
        style={[
          styles.shootingStarContainer,
          {
            opacity,
            transform: [{ translateX }, { translateY }, { rotate: "0deg" }],
          },
        ]}
      >
        <View style={styles.shootingStarHead} />
        <Animated.View style={{ width: tailLength }}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.6)", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.shootingStarTail}
          />
        </Animated.View>
      </Animated.View>
    </StarryBackground>
  );
};

const styles = StyleSheet.create({
  star: {
    position: "absolute",
    backgroundColor: "#ffffff",
  },
  shootingStarContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  shootingStarHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  shootingStarTail: {
    height: 0.5,
  },
});

export default ShootingStarSplashScreen;
