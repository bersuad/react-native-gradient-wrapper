import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Animated,
  Pressable,
  useColorScheme,
  ViewStyle,
  StyleProp,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

import {
  angleToDirection,
  buildBorderSweepGradient,
  getFullBorderGradient,
  getRotatingLayerStyle,
  getSweepRay,
  shouldUseIndividualBorders,
} from '../utils/gradientUtils';
import { getDefaultGradients } from '../utils/themeDefaults';
import { useRotatingAnimation } from '../hooks/useRotatingAnimation';
import { renderStaticBorders } from '../components/BorderRerender';
import { AnimatedBackground } from '../components/AnimatedBackground';
import type { GradientWrapperProps } from '../types';
import type { GradientComponent } from '../types/gradient';

const TRANSPARENT_FILL = ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'];

/**
 * Builds a GradientWrapper that renders with the given LinearGradient component.
 * Importing the gradient library statically (instead of a runtime require
 * fallback) is what lets Metro bundle it.
 */
export const createGradientWrapper = (
  Gradient: GradientComponent,
): React.FC<GradientWrapperProps> => {
  const GradientWrapper: React.FC<GradientWrapperProps> = ({
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
    noFill = false,
    overlayBg = false,
    borderSweep = false,
    borderSweepSpan = 0.22,
  }) => {
    const systemTheme = useColorScheme();
    const isDark = theme === 'dark' || (theme === 'auto' && systemTheme === 'dark');

    const [borderRotationStopped, setBorderRotationStopped] = useState(false);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateBgAnim = useRef(new Animated.Value(0)).current;
    const rotateBorderAnim = useRef(new Animated.Value(0)).current;

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    }, []);

    // Restart the border spin if rotation settings change after it stopped.
    const nextBorderRunKey = `${borderRotation}|${borderRotationSpeed}|${stopBorderAfter}`;
    const [borderRunKey, setBorderRunKey] = useState(nextBorderRunKey);
    if (borderRunKey !== nextBorderRunKey) {
      setBorderRunKey(nextBorderRunKey);
      setBorderRotationStopped(false);
    }

    useRotatingAnimation({
      rotation: backgroundRotation,
      rotationSpeed: backgroundRotationSpeed,
      animRef: rotateBgAnim,
      stopAfter: stopBackgroundAfter,
    });

    useRotatingAnimation({
      rotation: borderRotation,
      rotationSpeed: borderRotationSpeed,
      animRef: rotateBorderAnim,
      stopAfter: stopBorderAfter,
      onStop: () => setBorderRotationStopped(true),
    });

    // animRef counts whole turns (0, 1, 2, …). Extrapolate so values > 1 keep spinning
    // — required on web, where 0deg→360deg alone is a no-op.
    const spinBg = rotateBgAnim.interpolate({
      inputRange: [0, 1],
      outputRange:
        backgroundRotation === 'anticlockwise' ? ['0deg', '-360deg'] : ['0deg', '360deg'],
      extrapolate: 'extend',
    });

    const spinBorder = rotateBorderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: borderRotation === 'anticlockwise' ? ['0deg', '-360deg'] : ['0deg', '360deg'],
      extrapolate: 'extend',
    });

    const appliedBackground =
      noFill || overlayBg
        ? TRANSPARENT_FILL
        : (backgroundGradient ?? getDefaultGradients(theme, systemTheme).background);

    const hasBorderProps = Boolean(
      borderGradient ||
      borderTopGradient ||
      borderBottomGradient ||
      borderLeftGradient ||
      borderRightGradient,
    );

    const useIndividualBorders = shouldUseIndividualBorders({
      borderGradient,
      borderTopGradient,
      borderBottomGradient,
      borderLeftGradient,
      borderRightGradient,
    });

    const fullBorder = getFullBorderGradient({
      borderGradient,
      borderTopGradient,
      borderBottomGradient,
      borderLeftGradient,
      borderRightGradient,
      borderLocations,
      isDark,
    });

    const rotatingBorder =
      borderSweep && borderRotation !== 'none'
        ? buildBorderSweepGradient(fullBorder.colors, borderSweepSpan)
        : fullBorder;

    const fullBorderGradient = fullBorder.colors;
    const calculatedBorderLocations = fullBorder.locations;
    const rotatingBorderColors = rotatingBorder.colors;
    const rotatingBorderLocations = rotatingBorder.locations;
    const sweepRay =
      borderSweep && borderRotation !== 'none'
        ? getSweepRay(fullBorder.colors, borderSweepSpan, size.width, size.height, borderWidth)
        : null;

    const { start: bgStart, end: bgEnd } = angleToDirection(angle);
    const { start: borderStart, end: borderEnd } = angleToDirection(borderAngle);

    const handlePressIn = () => {
      if (!enableFeedback) return;
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
      if (!enableFeedback) return;
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    // Rotating layers are oversized to the box diagonal so corners never show through.
    const borderLayerStyle = getRotatingLayerStyle(size.width, size.height);
    const bgLayerStyle = getRotatingLayerStyle(
      size.width - borderWidth * 2,
      size.height - borderWidth * 2,
    );

    const borderContainerStyle: StyleProp<ViewStyle> = [
      { borderRadius, overflow: 'hidden' },
      style,
    ];

    const renderBorder = () => {
      // Solid ring from the first border stop — used for transparent/noFill cards.
      if (noFill && borderGradient) {
        return (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderWidth,
                borderColor: borderGradient[0] ?? 'transparent',
                borderRadius,
              },
            ]}
          />
        );
      }

      if (!borderRotationStopped && borderRotation !== 'none' && !noFill) {
        return (
          <Animated.View
            pointerEvents="none"
            style={[borderLayerStyle, { transform: [{ rotate: spinBorder }] }]}
          >
            {sweepRay ? (
              <Gradient
                testID="border-sweep-ray"
                colors={sweepRay.colors}
                locations={sweepRay.locations}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={sweepRay.style}
              />
            ) : (
              <Gradient
                colors={rotatingBorderColors}
                locations={rotatingBorderLocations}
                start={borderStart}
                end={borderEnd}
                style={StyleSheet.absoluteFill}
              />
            )}
          </Animated.View>
        );
      }

      if (noFill || useIndividualBorders) {
        return renderStaticBorders({
          Gradient,
          borderWidth,
          borderRadius,
          borderTopGradient,
          borderBottomGradient,
          borderLeftGradient,
          borderRightGradient,
        });
      }

      return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Gradient
            colors={fullBorderGradient}
            locations={calculatedBorderLocations}
            start={borderStart}
            end={borderEnd}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    };

    const renderBackground = () => {
      if (noFill) return null;

      const fill =
        animated && backgroundGradient && backgroundGradient.length >= 2 ? (
          <AnimatedBackground
            Gradient={Gradient}
            colors={overlayBg ? TRANSPARENT_FILL : backgroundGradient}
            speed={backgroundRotationSpeed}
            locations={backgroundLocations}
            start={bgStart}
            end={bgEnd}
          />
        ) : (
          <Gradient
            colors={appliedBackground}
            locations={backgroundLocations}
            start={bgStart}
            end={bgEnd}
            style={StyleSheet.absoluteFill}
          />
        );

      if (backgroundRotation === 'none') {
        return fill;
      }
      return (
        <Animated.View
          pointerEvents="none"
          style={[bgLayerStyle, { transform: [{ rotate: spinBg }] }]}
        >
          {fill}
        </Animated.View>
      );
    };

    const innerWrapper = (
      <Animated.View
        onLayout={handleLayout}
        style={[{ transform: [{ scale: scaleAnim }] }, borderContainerStyle]}
      >
        {hasBorderProps ? renderBorder() : null}

        <View
          style={[
            styles.inner,
            {
              margin: hasBorderProps ? borderWidth : 0,
              borderRadius: Math.max(0, borderRadius - (hasBorderProps ? borderWidth : 0)),
              backgroundColor: noFill ? 'transparent' : undefined,
            },
          ]}
        >
          {renderBackground()}
          <View style={[styles.fill, contentStyle]}>{children}</View>
        </View>
      </Animated.View>
    );

    return onPress || onLongPress ? (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.fill}
      >
        {innerWrapper}
      </Pressable>
    ) : (
      innerWrapper
    );
  };

  GradientWrapper.displayName = 'GradientWrapper';
  return GradientWrapper;
};

const styles = StyleSheet.create({
  inner: { flex: 1, overflow: 'hidden' },
  fill: { flex: 1 },
});
