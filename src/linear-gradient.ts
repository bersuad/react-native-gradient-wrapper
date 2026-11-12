// Bare React Native entry: import { GradientWrapper } from 'react-native-gradient-wrapper/linear-gradient';
import LinearGradient from 'react-native-linear-gradient';
import { createGradientWrapper } from './core/createGradientWrapper';
import type { GradientComponent } from './types/gradient';

export const GradientWrapper = createGradientWrapper(LinearGradient as GradientComponent);
export type { GradientWrapperProps, RotationDirection, ThemeMode } from './types';
export type { GradientComponent } from './types/gradient';
export { createGradientWrapper } from './core/createGradientWrapper';
