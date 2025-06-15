import React, { useEffect, useRef } from "react";
import Svg, { Circle, G, ClipPath, Defs } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Flower of Life SVG component with a smooth outward-rippling color animation.
 *
 * @param {object} props - The component props.
 * @param {number} props.size - The overall size (width and height) of the SVG.
 * @param {string} props.strokeColor - The starting color for the current animation cycle.
 * @param {string} props.nextStrokeColor - The ending color for the current animation cycle.
 * @param {number} props.strokeWidth - The stroke width for the circles.
 * @param {number} props.glowOpacity - The opacity for the petal glow effect.
 * @param {boolean} [props.triggerRipple=false] - A boolean flag to trigger the ripple animation.
 */
export const FlowerOfLifeSVG: React.FC<{
  size: number;
  strokeColor: string;
  strokeWidth: number;
  glowOpacity: number;
  transitionTimeout: number; // Main ripple duration
  nextStrokeColor?: string;
  triggerRipple?: boolean;
}> = ({
  size,
  strokeColor,
  strokeWidth,
  glowOpacity,
  transitionTimeout,
  nextStrokeColor = strokeColor,
  triggerRipple = false,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 6.5;

  const BOUNDARY_START_DELAY = transitionTimeout / 2; // Start boundary animation 400ms into the ripple
  const BOUNDARY_DURATION = transitionTimeout * (3 / 4); // Longer duration for smooth boundary transition

  // Shared values for petal animation
  const rippleProgress = useSharedValue(0);
  const animatedActualFromColor = useSharedValue(strokeColor);
  const animatedActualToColor = useSharedValue(nextStrokeColor);

  // Separate shared value for boundary animation progress (0 to 1)
  const boundaryProgress = useSharedValue(0);

  interface Petal {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }

  // Helper function to get intersection points of two circles
  const getIntersection = (circle1: Petal, circle2: Petal, r: number) => {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > r + r || d < Math.abs(r - r)) {
      return null;
    }

    const a = (r * r - r * r + d * d) / (2.0 * d);
    const x2 = circle1.x + (dx * a) / d;
    const y2 = circle1.y + (dy * a) / d;
    const h = Math.sqrt(r * r - a * a);
    const rx = -dy * (h / d);
    const ry = dx * (h / d);

    return {
      x: x2 - rx,
      y: y2 - ry,
    };
  };

  // Helper to get angle from the center
  const getPetalAngle = (x: number, y: number) => {
    let theta = Math.atan2(y - centerY, x - centerX);
    theta *= 180 / Math.PI;
    if (theta < 0) theta = 360 + theta;
    return Math.round(theta);
  };

  // Generate the centers of circles forming the Flower of Life pattern
  const generatePetals = (): Petal[] => {
    const allPetals: Petal[] = [];
    let firstIntersectionIndex = 0;
    let currentPetalCount = 0;

    for (let roundCount = 0; roundCount < 5; roundCount++) {
      const offset = roundCount > 0 ? 360 / (roundCount * 6) : 0;

      if (roundCount === 0) {
        const petal: Petal = {
          x: centerX,
          y: centerY,
          angle: getPetalAngle(centerX, centerY),
          distance: 0,
        };
        allPetals.push(petal);
        currentPetalCount++;
      }

      for (let i = 0; i < roundCount * 6; i++) {
        let petal: Petal | undefined;

        if (roundCount === 1 && i === 0) {
          const x = centerX + radius * Math.cos(0);
          const y = centerY + radius * Math.sin(0);
          petal = {
            x,
            y,
            angle: getPetalAngle(x, y),
            distance: Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2),
          };
        } else if (allPetals[currentPetalCount - 1] && allPetals[firstIntersectionIndex]) {
          const intersectionCoords = getIntersection(
            allPetals[currentPetalCount - 1],
            allPetals[firstIntersectionIndex],
            radius,
          );

          if (intersectionCoords) {
            petal = {
              x: intersectionCoords.x,
              y: intersectionCoords.y,
              angle: getPetalAngle(intersectionCoords.x, intersectionCoords.y),
              distance: Math.sqrt(
                (intersectionCoords.x - centerX) ** 2 + (intersectionCoords.y - centerY) ** 2,
              ),
            };
          }
        }

        if (petal) {
          allPetals.push(petal);
          currentPetalCount++;

          const vertexCalc = roundCount > 0 ? (petal.angle + offset) % 60 > 1 : false;

          if (i === roundCount * 6 - 1) {
            firstIntersectionIndex++;
          } else if (vertexCalc) {
            firstIntersectionIndex++;
          }
        } else {
          continue;
        }
      }
    }
    return allPetals;
  };

  const allPetals = useRef<Petal[]>(generatePetals()).current;
  const maxDistance = allPetals.length > 0 ? Math.max(...allPetals.map((p) => p.distance)) : 1;
  const patternRadius = radius * 2.2;
  const innerBoundaryRadius = patternRadius + radius + radius * 0.01;

  // Main animation controller with smooth boundary transition
  useEffect(() => {
    const targetColorForAnimation = nextStrokeColor || strokeColor;

    if (triggerRipple && strokeColor !== targetColorForAnimation) {
      // 1. Set the initial colors for petal animation
      animatedActualFromColor.value = strokeColor;
      animatedActualToColor.value = targetColorForAnimation;

      // 2. Reset progress values
      rippleProgress.value = 0;
      boundaryProgress.value = 0;

      // 3. Start petal ripple animation
      rippleProgress.value = withTiming(1, { duration: transitionTimeout });

      // 4. Start boundary animation with delay, overlapping with petal animation
      boundaryProgress.value = withDelay(
        BOUNDARY_START_DELAY,
        withTiming(1, { duration: BOUNDARY_DURATION }),
      );
    } else if (!triggerRipple) {
      // No ripple: set all elements to current strokeColor immediately
      animatedActualFromColor.value = strokeColor;
      animatedActualToColor.value = strokeColor;
      rippleProgress.value = withTiming(0, { duration: 0 });
      boundaryProgress.value = withTiming(0, { duration: 0 });
    }
  }, [triggerRipple, strokeColor, nextStrokeColor]);

  // Creates animated properties for each petal with staggered timing
  const createPetalProps = (petal: Petal) => {
    return useAnimatedProps(() => {
      const normalizedDistance = maxDistance === 0 ? 0 : petal.distance / maxDistance;
      const rippleStartSpreadFactor = 0.6;
      const individualPetalDurationFactor = 0.4;

      const petalAnimationStartPoint = normalizedDistance * rippleStartSpreadFactor;
      const currentPetalProgress = Math.max(
        0,
        Math.min(
          1,
          (rippleProgress.value - petalAnimationStartPoint) / individualPetalDurationFactor,
        ),
      );

      const interpolatedPetalColor = interpolateColor(
        currentPetalProgress,
        [0, 1],
        [animatedActualFromColor.value, animatedActualToColor.value],
      );

      return {
        stroke: interpolatedPetalColor,
        opacity: glowOpacity,
      };
    });
  };

  // Smooth boundary animation using interpolateColor
  const boundaryAnimatedProps = useAnimatedProps(() => {
    const interpolatedBoundaryColor = interpolateColor(
      boundaryProgress.value,
      [0, 1],
      [strokeColor, nextStrokeColor || strokeColor],
    );

    return {
      stroke: interpolatedBoundaryColor,
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="innerBoundaryClip">
          <Circle cx={centerX} cy={centerY} r={innerBoundaryRadius} />
        </ClipPath>
      </Defs>

      {/* All pattern circles with individual ripple timing */}
      <G clipPath="url(#innerBoundaryClip)">
        {allPetals.map((petal, index) => (
          <AnimatedCircle
            key={index}
            cx={petal.x}
            cy={petal.y}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            animatedProps={createPetalProps(petal)}
          />
        ))}
      </G>

      {/* Boundary circle with smooth delayed animation */}
      <AnimatedCircle
        cx={centerX}
        cy={centerY}
        r={innerBoundaryRadius}
        strokeWidth={strokeWidth + 1}
        fill="none"
        opacity={1}
        animatedProps={boundaryAnimatedProps}
      />
    </Svg>
  );
};
