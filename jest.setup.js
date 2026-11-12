// React Native's Jest preset mocks NativeAnimatedModule.getValue as a no-op,
// so Animated.Value#stopAnimation(callback) never calls back for native-driven
// values. Devices always call back; do the same here (the JS side reads 0).
const { NativeModules } = require('react-native');

NativeModules.NativeAnimatedModule.getValue.mockImplementation((_tag, callback) => {
  callback(0);
});
