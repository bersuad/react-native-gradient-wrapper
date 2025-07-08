import React from 'react';
import { Text, View } from 'react-native';
import GradientWrapper from 'react-native-gradient-wrapper';

export default function App() {
  return (
    <GradientWrapper
      backgroundGradient={['#ff9a9e', '#fad0c4']}
      borderGradient={['#fbc2eb', '#a6c1ee']}
      angle={45}
      borderWidth={4}
      borderRadius={20}
      style={{ margin: 20, padding: 20 }}
    >
      <Text style={{ fontSize: 18, color: 'white' }}>Hello Gradient World</Text>
    </GradientWrapper>
  );
}
