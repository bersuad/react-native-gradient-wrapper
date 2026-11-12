// The README examples, one per screen, for recording the README GIFs.
// Open the web build with ?example=<name>, e.g. http://localhost:8081/?example=spin
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createGradientWrapper } from '../src/core/createGradientWrapper';
import type { GradientComponent } from '../src/types/gradient';

export const README_EXAMPLES = ['button', 'spin', 'animated', 'sides'] as const;
export type ReadmeExample = (typeof README_EXAMPLES)[number];

export default function ReadmeExamples({ example }: { example: ReadmeExample }) {
  const GradientWrapper = useMemo(
    () => createGradientWrapper(LinearGradient as GradientComponent),
    [],
  );

  let content: React.ReactNode = null;

  if (example === 'button') {
    content = (
      <GradientWrapper
        borderGradient={['rgba(0, 0, 255, 0.9)', 'rgba(186, 0, 146, 0.97)']}
        borderAngle={46}
        borderWidth={2}
        borderRadius={30}
        backgroundGradient={['rgb(155, 70, 0)', 'rgb(50, 0, 56)']}
        angle={90}
        contentStyle={styles.buttonContent}
        onPress={() => {}}
      >
        <Text testID="target" style={styles.text}>
          Gradient Button
        </Text>
      </GradientWrapper>
    );
  }

  if (example === 'spin') {
    content = (
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
        style={styles.card}
      >
        <Text style={[styles.text, styles.cardText]}>Glowing card</Text>
      </GradientWrapper>
    );
  }

  if (example === 'animated') {
    content = (
      <GradientWrapper
        animated
        backgroundGradient={['#5A3F37', '#2C7744', '#1A2980']}
        backgroundRotationSpeed={1500}
        angle={46}
        borderWidth={0}
        borderRadius={0}
        style={styles.fill}
        contentStyle={styles.center}
      >
        <Text style={styles.text}>Animated background</Text>
      </GradientWrapper>
    );
  }

  if (example === 'sides') {
    content = (
      <GradientWrapper
        borderTopGradient={['#ff512f', '#dd2476']}
        borderBottomGradient={['#1a2980', '#26d0ce']}
        borderWidth={3}
        backgroundGradient={['#1f1f1f', '#1f1f1f']}
        style={styles.card}
      >
        <Text style={[styles.text, styles.cardText]}>Top and bottom borders</Text>
      </GradientWrapper>
    );
  }

  return (
    <View style={[styles.stage, example === 'animated' && styles.stageFlush]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stageFlush: {
    padding: 0,
    alignItems: 'stretch',
  },
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  buttonContent: { padding: 10, paddingHorizontal: 28, alignItems: 'center' },
  card: { width: 280 },
  text: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cardText: { padding: 16 },
});
