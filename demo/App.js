import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import GradientWrapperDemo from './GradientWrapperDemo';
import ReadmeExamples, { README_EXAMPLES } from './ReadmeExamples';

// Web only: ?example=<name> shows a single README example (used to record GIFs).
const example =
  typeof window !== 'undefined' && window.location
    ? new URLSearchParams(window.location.search).get('example')
    : null;

export default function App() {
  if (README_EXAMPLES.includes(example)) {
    return <ReadmeExamples example={example} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GradientWrapperDemo />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
});
