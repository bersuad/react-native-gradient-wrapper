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

## Installation

Install peer dependencies first:

```bash
npm install react-native-gradient-wrapper react-native-linear-gradient
```

If you're using **Expo**, install the linear gradient library with:

```bash
npx expo install react-native-gradient-wrapper expo-linear-gradient
```

Expo will automatically handle linking and compatibility.

---

## Border Gradient Usage

## <img src="https://github.com/bersuad/react-native-gradient-wrapper/blob/main/src/assets/demo-button.png" alt="Animated Gradient Button" width="250" />
```tsx
import { GradientWrapper } from 'react-native-gradient-wrapper';

<GradientWrapper
  borderGradient={['rgba(0, 0, 255, 0.9)', 'rgba(186, 0, 146, 0.97)']} 
  borderRadius={30}
  stopBorderAfter={300000} // stop after 30 sec
  borderAngle={46.38} // instead of start and end X,Y you can use angle
  borderWidth={2}
  contentStyle={{
    height: 35,
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    padding: 10,
  }}
  style={{ margin: 0 }}
  enableFeedback
  backgroundGradient={['rgb(155, 70, 0)', 'rgb(50, 0, 56)']}
  backgroundLocations={[0, 0.6, 1]}
  angle={90} // angle for background color
>
  <TouchableOpacity onPress={() => setSpeed(prev => Math.max(1000, prev - 500))}>
    <Text style={{ color: '#FFFFFF' }}>Animated Border Button</Text>
  </TouchableOpacity>
</GradientWrapper>

```

## <img src="https://github.com/bersuad/react-native-gradient-wrapper/blob/main/src/assets/background-demo.png" alt="Animated Background Gradient" width="250" />
## <video src="https://github.com/bersuad/react-native-gradient-wrapper/blob/main/src/assets/gradient-demo.mp4" controls autoplay loop width="100%"/>

## Background Color Usage
```tsx
import { GradientWrapper } from 'react-native-gradient-wrapper';

    <GradientWrapper
      backgroundGradient={['#5A3F37', '#2C7744', '#5A3F37']}
      backgroundRotationSpeed={4000}
      animated={true} //color rotation
      style={styles.container}
      borderWidth={0}
      angle={46.36}
    //   backgroundLocations={[0,0.5, 1]}//for background location
      borderRadius={0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Animated Background Gradient</Text>
      </View>
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
