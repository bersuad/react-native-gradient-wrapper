# Changelog

## 1.1.0

### Added

- Entry points for each gradient library: `react-native-gradient-wrapper/expo` and `react-native-gradient-wrapper/linear-gradient`. Metro bundles only the library you import.
- `createGradientWrapper(Component)` to build a wrapper around any LinearGradient-compatible component.
- `noFill` and `overlayBg` props for transparent backgrounds.
- Exported types: `GradientWrapperProps`, `RotationDirection`, `ThemeMode`, `GradientComponent`.
- CommonJS and ES module builds with an `exports` map, so the package works in Jest and Node as well as Metro.

### Changed

- `borderRotation` and `backgroundRotation` spin continuously at a constant speed instead of turning forward and back. The speed props are the time for one full turn. Rotation also works on web.
- Rotating layers are sized to the container's diagonal, so corners stay covered while spinning.
- `animated` runs on the native driver by crossfading gradient layers, with no JS work per frame. It accepts any color format and no longer jumps when the loop restarts.
- Both gradient libraries are now optional peer dependencies. Install the one you use.

### Fixed

- The build failed after the internal refactor.
- `rgb()` and `rgba()` colors crashed `animated`.
- The border rotation restarted on every render while the background was animating.
- Animations kept running after unmount when a stop timer was set.
- On web, `animated` stopped after one color cycle.
- A forced square size (60% of the screen width) and a pill-shaped default radius were removed. The default `borderRadius` is `10` again.

## 1.0.42

Last release before the changelog.
