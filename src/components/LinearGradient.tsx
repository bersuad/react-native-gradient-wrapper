import { Platform } from 'react-native';

let LinearGradient: any;

if (Platform.OS === 'web' || Platform.OS === 'android' || Platform.OS === 'ios') {
  try {
    LinearGradient = require('expo-linear-gradient').LinearGradient;
  } catch (e) {
    LinearGradient = require('react-native-linear-gradient').default;
  }
}

export default LinearGradient;
