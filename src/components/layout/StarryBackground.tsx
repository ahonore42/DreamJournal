import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import FadingStar from "../atoms/FadingStar";

const { width, height } = Dimensions.get("window");

interface StarryBackgroundProps {
  children?: React.ReactNode;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ children }) => {
  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => {
        const size = Math.random() * 2.5 + 1;
        const style = {
          top: Math.random() * height,
          left: Math.random() * width,
        };
        return <FadingStar key={`star-${i}`} size={size} style={style} />;
      }),
    [],
  );

  return (
    <View style={styles.container}>
      {backgroundStars}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000010",
    overflow: "hidden",
  },
});

export default StarryBackground;
