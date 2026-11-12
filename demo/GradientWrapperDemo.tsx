import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createGradientWrapper } from '../src/core/createGradientWrapper';
import type { GradientComponent } from '../src/types/gradient';

const GradientWrapperDemo = () => {
  // Build against local source so rotation/hook fixes hot-reload in the demo.
  const GradientWrapper = useMemo(
    () => createGradientWrapper(LinearGradient as GradientComponent),
    [],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>GradientWrapper Demo</Text>
      <Text style={styles.subheading}>Local v1.0.43 — noFill / overlayBg</Text>

      <GradientWrapper
        borderGradient={['#FF5F6D', '#FFC371']}
        backgroundGradient={['#2193b0', '#6dd5ed']}
        borderRadius={16}
        borderWidth={4}
        angle={135}
        style={styles.block}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>Simple Card</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        animated
        backgroundGradient={['#ff6a00', '#ee0979', '#ff6a00']}
        borderGradient={['#ffe259', '#ffa751']}
        backgroundRotationSpeed={3000}
        borderWidth={3}
        borderRadius={20}
        angle={45}
        style={styles.block}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>Animated Background</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        backgroundGradient={['#0f0c29', '#302b63', '#24243e']}
        borderGradient={['#ff0000', '#00ff00', '#0000ff', '#ff0000']}
        borderRotation="clockwise"
        borderRotationSpeed={2000}
        borderRadius={9999}
        borderWidth={6}
        angle={0}
        borderAngle={0}
        style={[styles.block, styles.circleWrap]}
        contentStyle={styles.circleContent}
      >
        <View style={styles.circle}>
          <Text style={styles.circleText}>Rotating Border</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        backgroundGradient={['#ff00aa', '#00e5ff', '#ff00aa']}
        borderGradient={['#ffff00', '#ff00ff', '#00ffff', '#ffff00']}
        borderRotation="anticlockwise"
        backgroundRotation="clockwise"
        borderRotationSpeed={2500}
        backgroundRotationSpeed={4000}
        borderRadius={24}
        borderWidth={4}
        angle={45}
        borderAngle={0}
        style={styles.block}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>Dual Rotation</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        noFill
        borderGradient={['#00e5ff', '#7b61ff']}
        borderWidth={2}
        borderRadius={16}
        style={styles.block}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>noFill + solid border</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        overlayBg
        borderGradient={['#ff5f6d', '#ffc371']}
        borderWidth={3}
        borderRadius={16}
        style={[styles.block, styles.overlayBlock]}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>overlayBg</Text>
        </View>
      </GradientWrapper>

      <GradientWrapper
        backgroundGradient={['#1a1a2e', '#16213e']}
        borderRadius={16}
        style={styles.block}
        contentStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>No border props</Text>
        </View>
      </GradientWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 24,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  subheading: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 8,
  },
  block: {
    width: '100%',
    maxWidth: 320,
    minHeight: 120,
    alignSelf: 'center',
  },
  content: {
    minHeight: 100,
    justifyContent: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  circleWrap: {
    width: 180,
    height: 180,
    minHeight: 180,
  },
  circleContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlayBlock: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});

export default GradientWrapperDemo;
