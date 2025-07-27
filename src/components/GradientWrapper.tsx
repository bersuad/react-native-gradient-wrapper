import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Pressable,
  useColorScheme,
  ViewStyle,
  StyleProp,
  StyleSheet,
  Easing,
} from 'react-native';
import LinearGradient from './LinearGradient';


type RotationDirection = 'clockwise' | 'anticlockwise' | 'none';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundGradient?: string[];
  borderGradient?: string[];
  borderTopGradient?: string[];
  borderBottomGradient?: string[];
  borderLeftGradient?: string[];
  borderRightGradient?: string[];
  borderWidth?: number;
  borderRadius?: number;
  backgroundRotation?: RotationDirection;
  borderRotation?: RotationDirection;
  backgroundRotationSpeed?: number;
  borderRotationSpeed?: number;
  stopBackgroundAfter?: number;
  stopBorderAfter?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  enableFeedback?: boolean;
  borderLocations?: number[];
  backgroundLocations?: number[];
  angle?: number;
  theme?: 'light' | 'dark' | 'auto';
  animated?: boolean;
  borderAngle?: number;
};

const defaultLightBackground = ['#ffffff', '#f2f2f2'];
const defaultDarkBackground = ['#2c3e50', '#1a1a1a'];
const defaultLightBorder = ['#ccc', '#eee'];
const defaultDarkBorder = ['#4b6cb7', '#182848'];

const GradientWrapper: React.FC<Props> = ({
  children,
  style,
  contentStyle,
  backgroundGradient,
  borderGradient,
  borderTopGradient,
  borderBottomGradient,
  borderLeftGradient,
  borderRightGradient,
  borderWidth = 2,
  borderRadius = 10,
  backgroundRotation = 'none',
  borderRotation = 'none',
  backgroundRotationSpeed = 4000,
  borderRotationSpeed = 3000,
  stopBackgroundAfter,
  stopBorderAfter,
  onPress,
  onLongPress,
  enableFeedback = true,
  angle,
  borderAngle,
  borderLocations,
  backgroundLocations,
  theme = 'auto',
  animated = false,
}) => {
  const systemTheme = useColorScheme();
  const isDark = theme === 'dark' || (theme === 'auto' && systemTheme === 'dark');

  const rotateBgAnim = useRef(new Animated.Value(0)).current;
  const rotateBorderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [borderRotationStopped, setBorderRotationStopped] = useState(false);
  const [animatedColorValue] = useState(new Animated.Value(0));
  const [animatedGradient, setAnimatedGradient] = useState<string[]>([]);
  const buildRgbString = (r: number, g: number, b: number) =>
    `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;

  const spinBg = rotateBgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: backgroundRotation === 'anticlockwise' ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  const spinBorder = rotateBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: borderRotation === 'anticlockwise' ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  const parseColorToRgb = (color: string): { r: number; g: number; b: number } => {
    color = color.trim();

    // HEX: #RGB or #RRGGBB
    if (color.startsWith('#')) {
      let cleaned = color.slice(1);
      if (cleaned.length === 3) {
        cleaned = cleaned
          .split('')
          .map((c) => c + c)
          .join('');
      }
      if (cleaned.length !== 6) {
        throw new Error(`Invalid hex color: ${color}`);
      }
      return {
        r: parseInt(cleaned.slice(0, 2), 16),
        g: parseInt(cleaned.slice(2, 4), 16),
        b: parseInt(cleaned.slice(4, 6), 16),
      };
    }

    // RGB or RGBA
    const rgbMatch = color.match(/^rgba?\(([^)]+)\)$/);
    if (rgbMatch) {
      const [r, g, b] = rgbMatch[1]
        .split(',')
        .slice(0, 3)
        .map((v) => parseInt(v.trim(), 10));
      if ([r, g, b].some((n) => isNaN(n))) {
        throw new Error(`Invalid RGB values: ${color}`);
      }
      return { r, g, b };
    }

    throw new Error(`Unsupported color format: ${color}`);
  };

  useEffect(() => {
    if (!animated || !backgroundGradient || backgroundGradient.length < 2) {
      return;
    }

    const speed = backgroundRotationSpeed || 500;

    const extendedColors = [...backgroundGradient, backgroundGradient[0]];
    const shiftedColors = [
      ...backgroundGradient.slice(1),
      backgroundGradient[0],
      backgroundGradient[1],
    ];
    const steps = extendedColors.length;

    animatedColorValue.setValue(0);

    const loop = Animated.loop(
      Animated.timing(animatedColorValue, {
        toValue: steps - 1,
        duration: (steps - 0.2) * speed,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    );
    loop.start();

    const rgbList = extendedColors.map(parseColorToRgb);
    const rgbShifted = shiftedColors.map(parseColorToRgb);

    const inputRange = rgbList.map((_, i) => i);

    const r1 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbList.map((c) => c.r),
    });
    const g1 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbList.map((c) => c.g),
    });
    const b1 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbList.map((c) => c.b),
    });

    const r2 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbShifted.map((c) => c.r),
    });
    const g2 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbShifted.map((c) => c.g),
    });
    const b2 = animatedColorValue.interpolate({
      inputRange,
      outputRange: rgbShifted.map((c) => c.b),
    });

    const listenerId = animatedColorValue.addListener(({ value }) => {
      const index = Math.floor(value);
      const fraction = value - index;
      const nextIndex = (index + 1) % rgbList.length;

      const r = rgbList[index].r + (rgbList[nextIndex].r - rgbList[index].r) * fraction;
      const g = rgbList[index].g + (rgbList[nextIndex].g - rgbList[index].g) * fraction;
      const b = rgbList[index].b + (rgbList[nextIndex].b - rgbList[index].b) * fraction;

      const r2 =
        rgbList[nextIndex].r +
        (rgbList[(nextIndex + 1) % rgbList.length].r - rgbList[nextIndex].r) * fraction;
      const g2 =
        rgbList[nextIndex].g +
        (rgbList[(nextIndex + 1) % rgbList.length].g - rgbList[nextIndex].g) * fraction;
      const b2 =
        rgbList[nextIndex].b +
        (rgbList[(nextIndex + 1) % rgbList.length].b - rgbList[nextIndex].b) * fraction;

      setAnimatedGradient([buildRgbString(r, g, b), buildRgbString(r2, g2, b2)]);
    });

    return () => {
      loop.stop();
      animatedColorValue.removeListener(listenerId);
    };
  }, [animated, backgroundGradient, backgroundRotationSpeed]);

  useEffect(() => {
    if (backgroundRotation !== 'none') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateBgAnim, {
            toValue: 1,
            duration: backgroundRotationSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateBgAnim, {
            toValue: 0,
            duration: backgroundRotationSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      if (stopBackgroundAfter) {
        setTimeout(() => {
          rotateBgAnim.stopAnimation();
        }, stopBackgroundAfter);
      }
    }

    if (borderRotation !== 'none') {
      let running = true;

      const animateLoop = () => {
        if (!running) {
          return;
        }

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
  }, []);

  const handlePressIn = () => {
    if (enableFeedback) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (enableFeedback) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const appliedBackground =
    backgroundGradient ?? (isDark ? defaultDarkBackground : defaultLightBackground);

  const shouldUseIndividualBorders = () => {
    if (borderGradient) {
      return false;
    }

    const individualBorderCount = [
      borderTopGradient,
      borderBottomGradient,
      borderLeftGradient,
      borderRightGradient,
    ].filter(Boolean).length;

    if (individualBorderCount <= 2) {
      return true;
    }

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

    if (
      !borderTopGradient &&
      !borderBottomGradient &&
      !borderLeftGradient &&
      !borderRightGradient
    ) {
      return {
        colors: isDark ? defaultDarkBorder : defaultLightBorder,
        locations: [0, 1],
      };
    }

    const gradients: string[] = [];

    // Right (optional)
    if (borderRightGradient) {
      gradients.push(...borderRightGradient);
    }

    // Bottom (100%)
    if (borderBottomGradient) {
      gradients.push(...borderBottomGradient);
    }

    // Left (optional)
    if (borderLeftGradient) {
      gradients.push(...borderLeftGradient);
    }

    // Top (100%)
    if (borderTopGradient) {
      gradients.push(...borderTopGradient);
    }

    const total = gradients.length;
    const locations = gradients.map((_, index) => index / (total - 1));

    return {
      colors: gradients,
      locations,
    };
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

  const useIndividualBorders = shouldUseIndividualBorders();
  const fullBorderGradientResult = getFullBorderGradient();
  const fullBorderGradient =
    typeof fullBorderGradientResult === 'object'
      ? fullBorderGradientResult.colors
      : fullBorderGradientResult;
  const calculatedBorderLocations =
    typeof fullBorderGradientResult === 'object'
      ? fullBorderGradientResult.locations
      : borderLocations;

  const appliedTop = borderTopGradient ?? fullBorderGradient;
  const appliedBottom = borderBottomGradient ?? fullBorderGradient;
  const appliedLeft = borderLeftGradient ?? fullBorderGradient;
  const appliedRight = borderRightGradient ?? fullBorderGradient;

  const angleToDirection = (
    angle: number,
  ): { start: { x: number; y: number }; end: { x: number; y: number } } => {
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return {
      start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
      end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
    };
  };

  const borderAngleToDirection = (
    borderAngle: number,
  ): { start: { x: number; y: number }; end: { x: number; y: number } } => {
    const radians = (borderAngle * Math.PI) / 180;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return {
      start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
      end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
    };
  };

  const { start: bgStart, end: bgEnd } =
    angle !== undefined ? angleToDirection(angle) : { start: { x: 0, y: 1 }, end: { x: 0, y: 1 } };

  const { start: bgBorderStart, end: bgBorderEnd } =
    borderAngle !== undefined
      ? borderAngleToDirection(borderAngle)
      : { start: { x: 0, y: 1 }, end: { x: 0, y: 1 } };

  const borderContainerStyle: StyleProp<ViewStyle> = [
    {
      borderRadius,
      overflow: 'hidden',
    },
    style,
  ];

  const renderStaticBorders = () => {
    const gradientSpan = 0.95; // 95% width

    return (
      <>
        {/* LEFT: Solid Blue */}
        {borderLeftGradient && (
          <View
            style={[borderStyles.left, { backgroundColor: borderLeftGradient[0] ?? 'transparent' }]}
          />
        )}

        {/* TOP: Red to Orange */}
        {borderTopGradient && (
          <LinearGradient
            colors={borderTopGradient}
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
            colors={borderBottomGradient}
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
  };

  const innerWrapper = (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, borderContainerStyle]}>
      {/* Border */}
      {!borderRotationStopped && borderRotation !== 'none' ? (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: spinBorder }] }]}>
          <LinearGradient
            colors={fullBorderGradient}
            locations={calculatedBorderLocations}
            start={bgBorderStart}
            end={bgBorderEnd}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : !useIndividualBorders ? (
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={fullBorderGradient}
            locations={calculatedBorderLocations}
            start={bgBorderStart}
            end={bgBorderEnd}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : (
        renderStaticBorders()
      )}

      {/* Background */}
      <View
        style={{
          margin: borderWidth,
          flex: 1,
          borderRadius: borderRadius - borderWidth,
          overflow: 'hidden',
        }}
      >
        {backgroundRotation !== 'none' ? (
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: spinBg }] }]}>
            <LinearGradient
              colors={
                animated && animatedGradient.length > 0 ? animatedGradient : appliedBackground
              }
              locations={backgroundLocations}
              start={bgStart}
              end={bgEnd}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : (
          <LinearGradient
            colors={animated && animatedGradient.length > 0 ? animatedGradient : appliedBackground}
            locations={backgroundLocations}
            start={bgStart}
            end={bgEnd}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Content */}
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      </View>
    </Animated.View>
  );

  return onPress || onLongPress ? (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      {innerWrapper}
    </Pressable>
  ) : (
    innerWrapper
  );
};

export default GradientWrapper;
