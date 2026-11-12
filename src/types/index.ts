import { ViewStyle, StyleProp } from 'react-native';

export type RotationDirection = 'clockwise' | 'anticlockwise' | 'none';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface GradientWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  // Background
  backgroundGradient?: string[];
  backgroundRotation?: RotationDirection;
  backgroundRotationSpeed?: number;
  backgroundLocations?: number[];
  stopBackgroundAfter?: number;

  // Border
  borderGradient?: string[];
  borderTopGradient?: string[];
  borderBottomGradient?: string[];
  borderLeftGradient?: string[];
  borderRightGradient?: string[];
  borderRotation?: RotationDirection;
  borderRotationSpeed?: number;
  stopBorderAfter?: number;
  borderWidth?: number;
  borderRadius?: number;
  borderLocations?: number[];
  borderAngle?: number;
  /**
   * When border rotation is on, concentrate the border colors into a short
   * highlight that travels around the whole control (like a single edge
   * sweeping the perimeter) instead of spinning a full multi-stop fill.
   */
  borderSweep?: boolean;
  /** How much of the ring the sweep highlight covers, 0–1. Default 0.22. */
  borderSweepSpan?: number;

  // Angles
  angle?: number;

  // Theme
  theme?: ThemeMode;

  // Animation
  animated?: boolean;

  /**
   * Skip the background gradient entirely and keep a transparent fill.
   * With `borderGradient`, draws a solid `borderColor` from the first stop
   * (`pointerEvents: 'none'`).
   */
  noFill?: boolean;

  /**
   * Force transparent background gradient colors. Still mounts a gradient
   * layer unless `noFill` is also set.
   */
  overlayBg?: boolean;

  // Interaction
  onPress?: () => void;
  onLongPress?: () => void;
  enableFeedback?: boolean;
}
