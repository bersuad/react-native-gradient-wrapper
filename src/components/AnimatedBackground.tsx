import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import type { GradientComponent, Point } from '../types/gradient';

interface AnimatedBackgroundProps {
  Gradient: GradientComponent;
  colors: string[];
  /** Time per color step, in ms (backgroundRotationSpeed). */
  speed: number;
  locations?: number[];
  start: Point;
  end: Point;
}

const EPSILON = 0.001;

/**
 * Opacity of layer j while progress runs 0 → n.
 *
 * Layer j shows [c_j, c_(j+1)]. While progress is between k and k+1 we need the
 * blend of layer k and layer k+1. Layers are stacked in index order, so layer
 * k+1 fades in on top of an opaque layer k. In the last step, layer n-1 fades
 * out to reveal layer 0, which is always opaque. Because a linear gradient is
 * linear in its colors, an opacity blend of two layers equals one gradient
 * with blended end colors.
 */
export const layerOpacity = (progress: Animated.Value, j: number, n: number) => {
  if (j === 0) return 1;
  if (j === n - 1) {
    return progress.interpolate({
      inputRange: [n - 2, n - 1, n],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
  }
  // Drop to 0 right after layer n-1 is fully opaque, so it fades straight to layer 0.
  return progress.interpolate({
    inputRange: [j - 1, j, n - 1, n - 1 + EPSILON],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
};

/**
 * Cycles the background colors with crossfading gradient layers. Runs entirely
 * on the native driver: no JS work or re-renders per frame.
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  Gradient,
  colors,
  speed,
  locations,
  start,
  end,
}) => {
  const n = colors.length;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let current: Animated.CompositeAnimation | undefined;

    // Restart each cycle by hand instead of Animated.loop: on web the native-driver
    // loop runs only once. The seam is invisible because progress n and 0 both
    // show layer 0 alone.
    const runCycle = () => {
      if (cancelled) return;
      progress.setValue(0);
      current = Animated.timing(progress, {
        toValue: n,
        duration: (n + 0.8) * (speed || 500),
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
      current.start(({ finished }) => {
        if (finished) runCycle();
      });
    };

    runCycle();
    return () => {
      cancelled = true;
      current?.stop();
    };
  }, [n, speed, progress]);

  const opacities = useMemo(
    () => Array.from({ length: n }, (_, j) => layerOpacity(progress, j, n)),
    [n, progress],
  );

  // Each layer has exactly two colors, so only two-stop locations apply.
  const layerLocations = locations && locations.length === 2 ? locations : undefined;

  return (
    <>
      {colors.map((color, j) => (
        <Animated.View
          // Layers are positional; the index is the identity.
          key={j}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: opacities[j] }]}
        >
          <Gradient
            colors={[color, colors[(j + 1) % n]]}
            locations={layerLocations}
            start={start}
            end={end}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ))}
    </>
  );
};
