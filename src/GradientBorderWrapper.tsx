import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColorScheme } from 'react-native';

type RotationDirection = 'clockwise' | 'anticlockwise' | 'none';

type BorderGradientProps = {
  borderGradient?: string[];
  borderTopGradient?: string[];
  borderBottomGradient?: string[];
  borderLeftGradient?: string[];
  borderRightGradient?: string[];
  borderWidth?: number;
  borderRadius?: number;
  borderRotation?: RotationDirection;
  borderRotationSpeed?: number;
  stopBorderAfter?: number;
  borderLocations?: number[];
  angle?: number;
  theme?: 'light' | 'dark' | 'auto';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const defaultLightBorder = ['#ccc', '#eee'];
const defaultDarkBorder = ['#4b6cb7', '#182848'];

const BorderGradient: React.FC<BorderGradientProps> = ({
  borderGradient,
  borderTopGradient,
  borderBottomGradient,
  borderLeftGradient,
  borderRightGradient,
  borderWidth = 2,
  borderRadius = 10,
  borderRotation = 'none',
  borderRotationSpeed = 3000,
  stopBorderAfter,
  borderLocations,
  angle,
  theme = 'auto',
  style,
  children,
}) => {
  const systemTheme = useColorScheme();
  const isDark = theme === 'dark' || (theme === 'auto' && systemTheme === 'dark');
  const rotateBorderAnim = useRef(new Animated.Value(0)).current;
  const [borderRotationStopped, setBorderRotationStopped] = useState(false);

  const spinBorder = rotateBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: borderRotation === 'anticlockwise' ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  useEffect(() => {
    if (borderRotation !== 'none') {
      let running = true;

      const animateLoop = () => {
        if (!running) return;

        Animated.sequence([
          Animated.timing(rotateBorderAnim, {
            toValue: 1,
            duration: borderRotationSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateBorderAnim, {
            toValue: 0,
            duration: borderRotationSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          animateLoop();
        });
      };

      animateLoop();

      if (stopBorderAfter) {
        setTimeout(() => {
          running = false;
          Animated.timing(rotateBorderAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            setBorderRotationStopped(true);
          });
        }, stopBorderAfter);
      }
    }
  }, [borderRotation, borderRotationSpeed, stopBorderAfter]);

  const shouldUseIndividualBorders = () => {
    if (borderGradient) return false;

    const individualBorderCount = [
      borderTopGradient,
      borderBottomGradient,
      borderLeftGradient,
      borderRightGradient,
    ].filter(Boolean).length;

    if (individualBorderCount <= 2) return true;

    const hasVertical = borderTopGradient || borderBottomGradient;
    const hasHorizontal = borderLeftGradient || borderRightGradient;
    return !(hasVertical && hasHorizontal);
  };

  const getFullBorderGradient = () => {
    if (borderGradient && borderGradient.length > 0) {
      return {
        colors: borderGradient,
        locations:
          borderLocations && borderLocations.length === borderGradient.length
            ? borderLocations
            : borderGradient.map((_, index) => index / (borderGradient.length - 1)),
      };
    }

    if (!borderTopGradient && !borderBottomGradient && !borderLeftGradient && !borderRightGradient) {
      return {
        colors: isDark ? defaultDarkBorder : defaultLightBorder,
        locations: [0, 1],
      };
    }

    let gradients: string[] = [];

    // Left gradient: start of the sequence
    if (borderLeftGradient) {
      gradients.push(...borderLeftGradient);
    }

    // Top gradient: 80% of top part, blending into right
    if (borderTopGradient) {
      gradients.push(...borderTopGradient);
      if (borderRightGradient) {
        // Blend top into right
        gradients.push(borderRightGradient[0]);
      }
    }

    // Right gradient: transition part
    if (borderRightGradient && !borderTopGradient) {
      gradients.push(borderRightGradient[0]);
    }

    // Bottom gradient: 80% of bottom part, blending into left
    if (borderBottomGradient) {
      gradients.push(...borderBottomGradient);
      if (borderLeftGradient && !borderLeftGradient.every((color) => gradients.includes(color))) {
        // Blend bottom into left, ensuring no color repetition
        gradients.push(borderLeftGradient[0]);
      }
    }

    // If no gradients were added, use default
    if (gradients.length === 0) {
      return {
        colors: isDark ? defaultDarkBorder : defaultLightBorder,
        locations: [0, 1],
      };
    }

    // Calculate locations to enforce 80% top, 80% bottom, with transitions
    const totalColors = gradients.length;
    const topLength = borderTopGradient ? Math.ceil(totalColors * 0.8) : 0;
    const bottomLength = borderBottomGradient ? Math.ceil(totalColors * 0.8) : 0;
    const transitionLength = totalColors - topLength - bottomLength;

    const locations = Array(totalColors).fill(0).map((_, index) => {
      if (borderTopGradient && index >= (borderLeftGradient ? borderLeftGradient.length : 0) && index < topLength + (borderLeftGradient ? borderLeftGradient.length : 0)) {
        // Top 80% mapped to 0.2–0.6 (after left)
        const topIndex = index - (borderLeftGradient ? borderLeftGradient.length : 0);
        return 0.2 + (topIndex / (topLength - 1)) * 0.4;
      } else if (borderBottomGradient && index >= totalColors - bottomLength) {
        // Bottom 80% mapped to 0.6–1.0
        const bottomIndex = index - (totalColors - bottomLength);
        return 0.6 + (bottomIndex / (bottomLength - 1)) * 0.4;
      } else {
        // Left and right transition parts
        const transitionIndex = index - (borderLeftGradient ? borderLeftGradient.length : 0);
        const adjustedTransitionLength = transitionLength + (borderLeftGradient ? borderLeftGradient.length : 0);
        return transitionIndex / (adjustedTransitionLength || 1) * 0.2;
      }
    });

    return { colors: gradients, locations };
  };

  const borderStyles = StyleSheet.create({
    top: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: borderWidth,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: borderWidth,
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    },
    left: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: borderWidth,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
    },
    right: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: borderWidth,
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    },
  });

  const angleToDirection = (angle: number): { start: { x: number; y: number }; end: { x: number; y: number } } => {
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return {
      start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
      end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
    };
  };

  const { start: borderStart, end: borderEnd } = angle !== undefined
    ? angleToDirection(angle)
    : { start: { x: 0, y: 1 }, end: { x: 0, y: 1 } };

  const useIndividualBorders = shouldUseIndividualBorders();
  const fullBorderGradientResult = getFullBorderGradient();
  const fullBorderGradient = fullBorderGradientResult.colors;
  const calculatedBorderLocations = fullBorderGradientResult.locations;

  const appliedTop = borderTopGradient ?? fullBorderGradient;
  const appliedBottom = borderBottomGradient ?? fullBorderGradient;
  const appliedLeft = borderLeftGradient ?? fullBorderGradient;
  const appliedRight = borderRightGradient ?? fullBorderGradient;

  const gradientSpan = 0.95; // 95% width for individual borders

  const renderStaticBorders = () => (
    <>
      {/* LEFT: Solid Blue */}
      {borderLeftGradient && (
        <View
          style={[
            borderStyles.left,
            { backgroundColor: borderLeftGradient[0] ?? 'transparent' },
          ]}
        />
      )}
      {/* TOP: Red to Orange */}
      {borderTopGradient && (
        <LinearGradient
          colors={appliedTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            borderStyles.top,
            {
              width: `${gradientSpan * 100}%`,
              alignSelf: 'center',
            },
          ]}
        />
      )}
      {/* RIGHT: Solid Yellow */}
      {borderRightGradient && (
        <View
          style={[
            borderStyles.right,
            { backgroundColor: borderRightGradient[0] ?? 'transparent' },
          ]}
        />
      )}
      {/* BOTTOM: Green Gradient */}
      {borderBottomGradient && (
        <LinearGradient
          colors={appliedBottom}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[
            borderStyles.bottom,
            {
              width: `${gradientSpan * 100}%`,
              alignSelf: 'center',
            },
          ]}
        />
      )}
    </>
  );

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]}>
      {!borderRotationStopped && borderRotation !== 'none' ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, { transform: [{ rotate: spinBorder }] }]}
        >
          <LinearGradient
            colors={fullBorderGradient}
            locations={calculatedBorderLocations}
            start={borderStart}
            end={borderEnd}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : !useIndividualBorders ? (
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={fullBorderGradient}
            locations={calculatedBorderLocations}
            start={borderStart}
            end={borderEnd}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : (
        renderStaticBorders()
      )}
      <View
        style={{
          margin: borderWidth,
          flex: 1,
          borderRadius: borderRadius - borderWidth,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default BorderGradient;