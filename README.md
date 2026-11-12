# react-native-gradient-wrapper

A React Native wrapper component that adds gradient backgrounds and gradient borders, with optional rotation and color animation. Works with Expo (`expo-linear-gradient`) and bare React Native (`react-native-linear-gradient`).

- Gradient backgrounds and borders, set by angle
- Color animation that cycles through the background colors
- Rotating background or border, with an optional stop timer
- Per-side border gradients
- Light, dark and system-theme defaults
- Scale feedback when pressed

Animations run on the native driver, so they don't block the JS thread.

<img src="https://raw.githubusercontent.com/bersuad/react-native-gradient-wrapper/main/docs/assets/all-demo.png" alt="GradientWrapper examples" width="320" />

## Installation

**Expo**

```bash
npx expo install react-native-gradient-wrapper expo-linear-gradient
```

**Bare React Native**

```bash
npm install react-native-gradient-wrapper react-native-linear-gradient
cd ios && pod install
```

## Importing

Import from the entry point that matches the gradient library you installed. Metro then bundles only that library.

```tsx
// Expo
import { GradientWrapper } from 'react-native-gradient-wrapper/expo';

// Bare React Native
import { GradientWrapper } from 'react-native-gradient-wrapper/linear-gradient';
```

The root import, `'react-native-gradient-wrapper'`, still works. It picks a library at runtime, which some Metro setups can't bundle when only one of the two libraries is installed. Prefer one of the entry points above.

To use a different LinearGradient-compatible component, build your own wrapper:

```tsx
import { createGradientWrapper } from 'react-native-gradient-wrapper/expo';
import MyGradient from './MyGradient';

export const GradientWrapper = createGradientWrapper(MyGradient);
```

## Examples

### Gradient border button

<img src="https://raw.githubusercontent.com/bersuad/react-native-gradient-wrapper/main/docs/assets/gradient-button.gif" alt="Gradient border button scaling down when pressed" width="360" />

```tsx
<GradientWrapper
  borderGradient={['rgba(0, 0, 255, 0.9)', 'rgba(186, 0, 146, 0.97)']}
  borderAngle={46}
  borderWidth={2}
  borderRadius={30}
  backgroundGradient={['rgb(155, 70, 0)', 'rgb(50, 0, 56)']}
  angle={90}
  contentStyle={{ padding: 10, alignItems: 'center' }}
  onPress={() => console.log('pressed')}
>
  <Text style={{ color: '#fff' }}>Gradient Button</Text>
</GradientWrapper>
```

### Spinning border

<img src="https://raw.githubusercontent.com/bersuad/react-native-gradient-wrapper/main/docs/assets/spinning-border.gif" alt="Card with a multicolor border that spins continuously" width="360" />

The border turns continuously. `borderRotationSpeed` is the time for one full turn. With `stopBorderAfter`, the current turn finishes and the border comes to rest.

```tsx
<GradientWrapper
  borderGradient={['#ff512f', '#ffd200', '#21d4fd', '#b721ff', '#ff512f']}
  borderAngle={0}
  borderRotation="clockwise"
  borderRotationSpeed={3000}
  stopBorderAfter={30000}
  borderWidth={4}
  borderRadius={16}
  backgroundGradient={['#1a1a2e', '#16213e']}
  angle={90}
>
  <Text style={{ color: '#fff', padding: 16 }}>Glowing card</Text>
</GradientWrapper>
```

### Animated background

<img src="https://raw.githubusercontent.com/bersuad/react-native-gradient-wrapper/main/docs/assets/animated-background.gif" alt="Background gradient cycling through brown, green and blue" width="360" />

With `animated`, the background cycles through every color in `backgroundGradient`. `backgroundRotationSpeed` sets how long each color step takes.

```tsx
<GradientWrapper
  animated
  backgroundGradient={['#5A3F37', '#2C7744', '#1A2980']}
  backgroundRotationSpeed={1500}
  angle={46}
  borderWidth={0}
  borderRadius={0}
  style={{ flex: 1 }}
>
  <Text style={{ color: '#fff' }}>Animated background</Text>
</GradientWrapper>
```

[Watch the demo video](https://github.com/bersuad/react-native-gradient-wrapper/blob/main/docs/assets/gradient-demo.mp4)

### Per-side borders

```tsx
<GradientWrapper
  borderTopGradient={['#ff512f', '#dd2476']}
  borderBottomGradient={['#1a2980', '#26d0ce']}
  borderWidth={3}
>
  <Text style={{ padding: 16 }}>Top and bottom borders</Text>
</GradientWrapper>
```

## Props

All props are optional except `children`.

### Layout

| Prop           | Type                   | Default | Description                                     |
| -------------- | ---------------------- | ------- | ----------------------------------------------- |
| `children`     | `ReactNode`            |         | Content to render inside the wrapper.           |
| `style`        | `StyleProp<ViewStyle>` |         | Style for the outer container (size, margin).   |
| `contentStyle` | `StyleProp<ViewStyle>` |         | Style for the inner content view (padding).     |
| `borderWidth`  | `number`               | `2`     | Border thickness. Use `0` for no border.        |
| `borderRadius` | `number`               | `10`    | Corner radius. Use a large value for a pill.    |

### Background

| Prop                      | Type                                       | Default         | Description                                                                                   |
| ------------------------- | ------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------- |
| `backgroundGradient`      | `string[]`                                 | theme default   | Background colors.                                                                            |
| `backgroundLocations`     | `number[]`                                 |                 | Color stop positions from 0 to 1. With `animated`, only used if it has exactly 2 values.      |
| `angle`                   | `number`                                   |                 | Gradient direction in degrees. `0` is left to right, `90` is top to bottom.                   |
| `animated`                | `boolean`                                  | `false`         | Cycle through the background colors. Needs at least 2 colors.                                 |
| `backgroundRotation`      | `'clockwise' \| 'anticlockwise' \| 'none'` | `'none'`        | Spin the background.                                                                          |
| `backgroundRotationSpeed` | `number`                                   | `4000`          | Milliseconds per full turn when rotating, and per color step when `animated`.                 |
| `stopBackgroundAfter`     | `number`                                   |                 | Stop the background rotation after this many milliseconds.                                    |
| `noFill`                  | `boolean`                                  | `false`         | Skip the background and keep it transparent. With `borderGradient`, draws a solid border from its first color. |
| `overlayBg`               | `boolean`                                  | `false`         | Make the background colors transparent while still rendering the gradient layer.             |

### Border

| Prop                   | Type                                       | Default       | Description                                                       |
| ---------------------- | ------------------------------------------ | ------------- | ----------------------------------------------------------------- |
| `borderGradient`       | `string[]`                                 | theme default | Colors for the whole border.                                      |
| `borderLocations`      | `number[]`                                 | even spacing  | Color stop positions. Ignored unless it matches `borderGradient`. |
| `borderAngle`          | `number`                                   |               | Border gradient direction in degrees.                             |
| `borderTopGradient`    | `string[]`                                 |               | Top border colors.                                                |
| `borderBottomGradient` | `string[]`                                 |               | Bottom border colors.                                             |
| `borderLeftGradient`   | `string[]`                                 |               | Left border colors.                                               |
| `borderRightGradient`  | `string[]`                                 |               | Right border colors.                                              |
| `borderRotation`       | `'clockwise' \| 'anticlockwise' \| 'none'` | `'none'`      | Spin the border.                                                  |
| `borderRotationSpeed`  | `number`                                   | `3000`        | Milliseconds per full turn.                                       |
| `stopBorderAfter`      | `number`                                   |               | Stop the border rotation after this many milliseconds.            |

`borderGradient` takes priority over the per-side props. When one or two sides are set, each side is drawn separately. When three or four sides are set, their colors are joined into one gradient around the border.

### Theme and interaction

| Prop             | Type                          | Default  | Description                                                     |
| ---------------- | ----------------------------- | -------- | --------------------------------------------------------------- |
| `theme`          | `'light' \| 'dark' \| 'auto'` | `'auto'` | Picks the default colors. `'auto'` follows the system setting.  |
| `onPress`        | `() => void`                  |          | Makes the wrapper pressable.                                    |
| `onLongPress`    | `() => void`                  |          | Long-press handler. Also makes the wrapper pressable.           |
| `enableFeedback` | `boolean`                     | `true`   | Scale down slightly while pressed.                              |

### Notes

- Set `angle` and `borderAngle` to get a visible gradient direction. Without them the start and end points are the same, which matches 1.0.x behavior.
- Rotating layers are sized to the container's diagonal, so the corners stay covered while they spin.

## Comparison

| Feature                       | react-native-gradient-wrapper | react-native-linear-gradient | react-native-gradients | react-native-animated-linear-gradient |
| ----------------------------- | ----------------------------- | ---------------------------- | ---------------------- | ------------------------------------- |
| Background gradient           | Yes                           | Yes                          | Yes                    | Yes                                   |
| Border gradient               | Yes                           | No                           | No                     | No                                    |
| Animated color transition     | Yes                           | No                           | No                     | Background only                       |
| Rotation animation            | Yes                           | No                           | No                     | No                                    |
| Per-side border control       | Yes                           | No                           | No                     | No                                    |
| Theme-aware default colors    | Yes                           | No                           | No                     | No                                    |
| Press feedback                | Yes                           | No                           | No                     | No                                    |
| Angle-based direction         | Yes                           | Yes                          | Yes                    | Yes                                   |
| Stop animations after a delay | Yes                           | No                           | No                     | No                                    |

GradientWrapper draws its gradients with `expo-linear-gradient` or `react-native-linear-gradient`, depending on the entry point you import.

## Development

```bash
npm install
npm run typecheck   # TypeScript
npm run lint        # ESLint and Prettier
npm test            # Jest
npm run build       # CommonJS, ES modules and type definitions in lib/
```

The demo app in `demo/demo` is an Expo project:

```bash
cd demo/demo && npm install && npx expo start
```

## License

MIT
