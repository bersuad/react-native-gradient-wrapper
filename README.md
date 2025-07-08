# react-native-gradient-wrapper

A flexible React Native gradient wrapper component with animated borders and backgrounds.

## Features

- Customizable gradient background
- Animated rotating gradient borders
- Supports dark and light mode
- Press feedback (scale effect)
- Optional angle-based gradient directions

## Installation

```bash
npm install react-native-gradient-wrapper react-native-linear-gradient
```

## Usage

```tsx
import { GradientWrapper } from 'react-native-gradient-wrapper';

<GradientWrapper
  backgroundGradient={['#4c669f', '#3b5998', '#192f6a']}
  angle={45}
  borderWidth={3}
  borderRadius={12}
  onPress={() => console.log('Pressed!')}
  style={[styles.customStyle]}
>
  <Text style={{ color: 'white' }}>Hello Gradient</Text>
</GradientWrapper>
```

## Props

Check `src/GradientWrapper.tsx` for all available props and defaults.

## License

MIT
