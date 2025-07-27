# GradientWrapper for React Native

**GradientWrapper** is a flexible, animated wrapper component for React Native that adds background and border gradients with support for animations, angle directions, theming, and per-side customization. It’s designed to be beginner-friendly while still powerful enough for advanced use cases.

* ✅ Custom **background gradients**
* ✅ Animated **gradient transitions** (color morphing)
* ✅ Rotating **background** or **border gradients**
* ✅ **Light/Dark/Auto** theme-aware defaults
* ✅ **Angle-based** direction control for gradients
* ✅ **Per-side** border gradient customization
* ✅ Touchable feedback (scale on press)
* ✅ Optional gradient animation stop timers (`stopBackgroundAfter`, `stopBorderAfter`)

---

## 🔧 Installation

Install peer dependencies first:

```bash
npm install react-native-gradient-wrapper react-native-linear-gradient
```

Then copy the `GradientWrapper.tsx` file into your project.

If you're using **Expo**, install the linear gradient library with:

```bash
npx expo install react-native-gradient-wrapper react-native-linear-gradient
```

Expo will automatically handle linking and compatibility.

---

## Usage

```tsx
import GradientWrapper from './GradientWrapper';

<GradientWrapper
  backgroundGradient={["#ff7e5f", "#feb47b"]}
  borderGradient={["#6a11cb", "#2575fc"]}
  borderRadius={20}
  borderWidth={1} // don't forget to make this 0(zero) if you aren't using it
  backgroundRotation="clockwise"
  borderRotation="anticlockwise"
  animated
  stopBackgroundAfter={5000} // stop after 5s
  stopBorderAfter={3000}    // stop after 10s
  angle={45}
  backgroundRotationSpeed={9000} // background spins every 3 seconds
  borderRotationSpeed={8000}
>
  <Text style={{ color: '#fff' }}>Hello Gradient</Text>
</GradientWrapper>
```

---

## Props Reference

| Prop                      | Type                                       | Description                                       |
| ------------------------- | ------------------------------------------ | ------------------------------------------------- |
| `backgroundGradient`      | `string[]`                                 | Background color array                            |
| `borderGradient`          | `string[]`                                 | Border color array (fallback if no sides defined) |
| `borderTopGradient`       | `string[]`                                 | Top border only                                   |
| `borderBottomGradient`    | `string[]`                                 | Bottom border only                                |
| `borderLeftGradient`      | `string[]`                                 | Left border only                                  |
| `borderRightGradient`     | `string[]`                                 | Right border only                                 |
| `borderWidth`             | `number`                                   | Width of the border (default `2`)                 |
| `borderRadius`            | `number`                                   | Corner radius (default `10`)                      |
| `backgroundRotation`      | `'clockwise' \| 'anticlockwise' \| 'none'` | Rotating background effect                        |
| `borderRotation`          | `'clockwise' \| 'anticlockwise' \| 'none'` | Rotating border effect                            |
| `backgroundRotationSpeed` | `number`                                   | Milliseconds for one background rotation cycle    |
| `borderRotationSpeed`     | `number`                                   | Milliseconds for one border rotation cycle        |
| `stopBackgroundAfter`     | `number`                                   | Stops background animation after X ms             |
| `stopBorderAfter`         | `number`                                   | Stops border animation after X ms                 |
| `animated`                | `boolean`                                  | Animate colors across gradient stops              |
| `angle`                   | `number`                                   | Direction in degrees (e.g. `45`) for background   |
| `borderAngle`             | `number`                                   | Direction in degrees for border gradient          |
| `theme`                   | `'light' \| 'dark' \| 'auto'`              | Theme-based fallback gradient colors              |
| `onPress`, `onLongPress`  | `() => void`                               | Press handlers                                    |
| `enableFeedback`          | `boolean`                                  | Scale animation on press (default `true`)         |

---

## Comparison with Other Libraries

| Feature / Library                   | react-native-gradient-wrapper | react-native-linear-gradient | react-native-gradients | react-native-animated-linear-gradient |
| ----------------------------------- | ----------------- | ---------------------------- | ---------------------- | ------------------------------------- |
| ✅ Background gradient support       | ✅                 | ✅                            | ✅                      | ✅                                     |
| ✅ Border gradient                   | ✅                 | ❌                            | ❌                      | ❌                                     |
| ✅ Animated color transition (morph) | ✅                 | ❌                            | ❌                      | ✅ (only background)                   |
| ✅ Rotation animation support        | ✅                 | ❌                            | ❌                      | ❌                                     |
| ✅ Per-side border control           | ✅                 | ❌                            | ❌                      | ❌                                     |
| ✅ Theme-aware fallback colors       | ✅                 | ❌                            | ❌                      | ❌                                     |
| ✅ Pressable feedback (scale)        | ✅                 | ❌                            | ❌                      | ❌                                     |
| ✅ Angle-based gradient direction    | ✅                 | ✅                            | ✅                      | ✅                                     |
| ✅ Stop animations after delay       | ✅                 | ❌                            | ❌                      | ❌                                     |

> **Note:** `GradientWrapper` internally uses `react-native-linear-gradient` and extends it with a complete system of wrappers, animations, fallback themes, and UI feedback.

---

## Ideal Use Cases

* Buttons with animated borders
* Cards with glowing outlines
* Containers with gradient backgrounds
* Interactive boxes with animated themes
* Light/Dark mode responsive UI blocks

---

## Future Plans

* Support for Lottie-like morphing gradients
* Web support (React Native Web)
* Built-in presets (e.g. fire, neon, galaxy)

---

## Props

Check `src/index.tsx` for all available props and defaults.

## License

MIT
