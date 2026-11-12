import type { ComponentType } from 'react';

export type Point = { x: number; y: number };

/**
 * Any LinearGradient-compatible component, such as the one from
 * expo-linear-gradient or react-native-linear-gradient.
 */
export type GradientComponent = ComponentType<any>;
