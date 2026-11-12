// Default build: picks expo-linear-gradient or react-native-linear-gradient at
// runtime, as in 1.0.x. For Metro-safe imports use the /expo or
// /linear-gradient entry points instead.
import LinearGradient from './LinearGradient';
import { createGradientWrapper } from '../core/createGradientWrapper';

const GradientWrapper = createGradientWrapper(LinearGradient);

export default GradientWrapper;
