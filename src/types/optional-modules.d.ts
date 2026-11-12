// Minimal typing so the library type-checks without the Expo SDK installed.
// Delete this file if expo-linear-gradient is added as a devDependency.
declare module 'expo-linear-gradient' {
  import type { ComponentType } from 'react';
  export const LinearGradient: ComponentType<any>;
}
