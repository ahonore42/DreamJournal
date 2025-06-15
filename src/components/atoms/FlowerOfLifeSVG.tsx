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
 * Flower of Life SVG component with an outward-rippling color animation.
 *
 * @param {object} props - The component props.
 * @param {number} props.size - The overall size (width and height) of the SVG.
 * @param {string} props.strokeColor - The starting color for the current animation cycle (the color the flower currently is).
 * @param {string} props.nextStrokeColor - The ending color for the current animation cycle (the color the flower should animate to).
 * @param {number} props.strokeWidth - The stroke width for the circles.
 * @param {number} props.glowOpacity - The opacity for the petal glow effect.
 * @param {boolean} [props.triggerRipple=false] - A boolean flag to explicitly trigger the ripple animation.
 */
export const FlowerOfLifeSVG: React.FC<{
  size: number;
  strokeColor: string;
  strokeWidth: number;
  glowOpacity: number;
  nextStrokeColor?: string;
  triggerRipple?: boolean;
}> = ({ size, strokeColor, strokeWidth, glowOpacity, nextStrokeColor = strokeColor, triggerRipple = false }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  // Radius of individual circles forming the pattern
  const radius = size / 6.5;

  const RIPPLE_DURATION = 800; // Milliseconds for the main ripple effect (inner petals)
  const BOUNDARY_TRANSITION_DURATION = 300; // Milliseconds for the boundary fade *after* ripple

  // This shared value controls the overall ripple animation progress from 0 to 1.
  const rippleProgress = useSharedValue(0);

  // These shared values store the *actual* from and to colors for the *currently active* animation of the petals.
  const animatedActualFromColor = useSharedValue(strokeColor);
  const animatedActualToColor = useSharedValue(nextStrokeColor);

  // Shared value for the boundary circle's color. Initialize it with the current strokeColor.
  const animatedBoundaryColor = useSharedValue(strokeColor);

  interface Petal {
    x: number;
    y: number;
    angle: number;
    distance: number; // Pre-calculate distance from the center for ripple staggering
  }

  // Helper function to get intersection points of two circles.
  const getIntersection = (circle1: Petal, circle2: Petal, r: number) => {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > (r + r) || d < Math.abs(r - r)) {
      return null;
    }

    const a = ((r * r) - (r * r) + (d * d)) / (2.0 * d);
    const x2 = circle1.x + (dx * a / d);
    const y2 = circle1.y + (dy * a / d);
    const h = Math.sqrt((r * r) - (a * a));
    const rx = -dy * (h / d);
    const ry = dx * (h / d);

    return {
      x: x2 - rx,
      y: y2 - ry
    };
  };

  // Helper to get angle from the center.
  const getPetalAngle = (x: number, y: number) => {
    let theta = Math.atan2(y - centerY, x - centerX);
    theta *= 180 / Math.PI; // Convert to degrees
    if (theta < 0) theta = 360 + theta; // Ensure positive angle
    return Math.round(theta);
  };

  // Generates the centers of the circles that form the Flower of Life pattern.
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
          distance: 0 // Center petal has 0 distance
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
            distance: Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          };
        } else if (allPetals[currentPetalCount - 1] && allPetals[firstIntersectionIndex]) {
          const intersectionCoords = getIntersection(
            allPetals[currentPetalCount - 1],
            allPetals[firstIntersectionIndex],
            radius
          );

          if (intersectionCoords) {
            petal = {
              x: intersectionCoords.x,
              y: intersectionCoords.y,
              angle: getPetalAngle(intersectionCoords.x, intersectionCoords.y),
              distance: Math.sqrt((intersectionCoords.x - centerX) ** 2 + (intersectionCoords.y - centerY) ** 2)
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
  const maxDistance = allPetals.length > 0 ? Math.max(...allPetals.map(p => p.distance)) : 1;
  const patternRadius = radius * 2.2;
  const innerBoundaryRadius = patternRadius + radius + (radius * 0.01);

  // This useEffect is the core animation controller for FlowerOfLifeSVG.
  // It synchronizes with the `triggerRipple` prop and the color changes.
  useEffect(() => {
    const targetColorForAnimation = nextStrokeColor || strokeColor;

    if (triggerRipple && strokeColor !== targetColorForAnimation) {
      // 1. Set the initial 'from' and 'to' colors for the petal ripple animation.
      animatedActualFromColor.value = strokeColor;
      animatedActualToColor.value = targetColorForAnimation;

      // Ensure the boundary color starts from the current `strokeColor` for this cycle,
      // and will only animate *after* the delay.
      animatedBoundaryColor.value = strokeColor; // Initialize before the delayed animation.

      // 2. Start the petal ripple animation (0 to 1).
      rippleProgress.value = 0; // Reset to ensure animation starts from beginning
      rippleProgress.value = withTiming(1, { duration: RIPPLE_DURATION }, (finished) => {
        if (finished) {
          // Once the petal ripple is complete, fix the internal petal colors to the target.
          animatedActualFromColor.value = targetColorForAnimation;
          // Reset ripple progress for the next animation cycle.
          rippleProgress.value = withTiming(0, { duration: 0 });

          // NOW, after the petal ripple finishes, start the boundary color transition.
          animatedBoundaryColor.value = withTiming(targetColorForAnimation, { duration: BOUNDARY_TRANSITION_DURATION });
        }
      });

    } else if (!triggerRipple) {
      // 3. If no ripple is triggered (initial render or state has settled):
      //    Ensure all elements (petals and boundary) are immediately set to the `strokeColor`.
      animatedActualFromColor.value = strokeColor;
      animatedActualToColor.value = strokeColor;
      // When not triggering a ripple, the boundary should immediately reflect the strokeColor.
      animatedBoundaryColor.value = strokeColor;
      rippleProgress.value = withTiming(0, { duration: 0 }); // Ensure no lingering animation progress
    }
  }, [triggerRipple, strokeColor, nextStrokeColor]); // Re-run this effect when these props change.

  // Creates the animated properties for each individual petal.
  const createPetalProps = (petal: Petal) => {
    return useAnimatedProps(() => {
      const normalizedDistance = maxDistance === 0 ? 0 : petal.distance / maxDistance;
      const rippleStartSpreadFactor = 0.6; // How much of the total duration is used to spread start times
      const individualPetalDurationFactor = 0.4; // How much of the total duration each petal's color transition takes

      const petalAnimationStartPoint = normalizedDistance * rippleStartSpreadFactor;
      const currentPetalProgress = Math.max(
        0,
        Math.min(1, (rippleProgress.value - petalAnimationStartPoint) / individualPetalDurationFactor)
      );

      const interpolatedPetalColor = interpolateColor(
        currentPetalProgress,
        [0, 1],
        [animatedActualFromColor.value, animatedActualToColor.value]
      );

      return {
        stroke: interpolatedPetalColor,
        opacity: glowOpacity,
      };
    });
  };

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

      {/* Boundary circle. Its color is now animated independently after a delay. */}
      <AnimatedCircle
        cx={centerX}
        cy={centerY}
        r={innerBoundaryRadius}
        strokeWidth={strokeWidth + 1}
        fill="none"
        opacity={1}
        animatedProps={useAnimatedProps(() => ({
          // The boundary circle's stroke color directly uses the animated value,
          // which will only change after the defined delay and duration.
          stroke: animatedBoundaryColor.value,
        }))}
      />
    </Svg>
  );
};
