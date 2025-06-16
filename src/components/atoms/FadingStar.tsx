import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";

interface StarProps {
  size: number;
  style: any;
}

const FadingStar: React.FC<StarProps> = ({ size, style }) => {
  const opacity = useRef(new Animated.Value(Math.random() * 0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: Math.random() * 0.6 + 0.4,
          duration: Math.random() * 2000 + 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 2000 + 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        { width: size, height: size, borderRadius: size / 2 },
        style,
        { opacity },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  star: {
    position: "absolute",
    backgroundColor: "#ffffff",
  },
});

export default FadingStar;
