jest.mock(
  'expo-linear-gradient',
  () => {
    const { View } = require('react-native');
    return { LinearGradient: (props: object) => <View testID="expo-gradient" {...props} /> };
  },
  { virtual: true },
);

describe('entry points', () => {
  it.each([
    ['root', '../index'],
    ['expo', '../expo'],
    ['linear-gradient', '../linear-gradient'],
  ])('%s exports GradientWrapper and createGradientWrapper', (_, path) => {
    const mod = require(path);
    expect(typeof mod.GradientWrapper).toBe('function');
    expect(typeof mod.createGradientWrapper).toBe('function');
    expect(mod.GradientWrapper.displayName).toBe('GradientWrapper');
  });
});
