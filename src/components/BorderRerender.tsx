import { StyleSheet, View, ViewStyle } from 'react-native';
import type { GradientComponent } from '../types/gradient';

interface StaticBorderProps {
  Gradient: GradientComponent;
  borderWidth: number;
  borderRadius: number;
  borderTopGradient?: string[];
  borderBottomGradient?: string[];
  borderLeftGradient?: string[];
  borderRightGradient?: string[];
}

export const renderStaticBorders = ({
  Gradient,
  borderWidth,
  borderRadius,
  borderTopGradient,
  borderBottomGradient,
  borderLeftGradient,
  borderRightGradient,
}: StaticBorderProps) => {
  return (
    <>
      {/* Left: Solid */}
      {borderLeftGradient && (
        <View
          style={[
            styles.left(borderWidth, borderRadius),
            { backgroundColor: borderLeftGradient[0] ?? 'transparent' },
          ]}
        />
      )}

      {/* Top: Gradient */}
      {borderTopGradient && (
        <Gradient
          colors={borderTopGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.top(borderWidth, borderRadius), fixed.span]}
        />
      )}

      {/* Right: Solid */}
      {borderRightGradient && (
        <View
          style={[
            styles.right(borderWidth, borderRadius),
            { backgroundColor: borderRightGradient[0] ?? 'transparent' },
          ]}
        />
      )}

      {/* Bottom: Gradient */}
      {borderBottomGradient && (
        <Gradient
          colors={borderBottomGradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.bottom(borderWidth, borderRadius), fixed.span]}
        />
      )}
    </>
  );
};

// Top and bottom borders span 95% of the width.
const fixed = StyleSheet.create({
  span: { width: '95%', alignSelf: 'center' },
});

const styles = {
  top: (borderWidth: number, borderRadius: number): ViewStyle => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: borderWidth,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  }),
  bottom: (borderWidth: number, borderRadius: number): ViewStyle => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: borderWidth,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  }),
  left: (borderWidth: number, borderRadius: number): ViewStyle => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: borderWidth,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  }),
  right: (borderWidth: number, borderRadius: number): ViewStyle => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: borderWidth,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  }),
};
