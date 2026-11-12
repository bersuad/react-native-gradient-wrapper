import { Animated } from 'react-native';
import { layerOpacity } from '../components/AnimatedBackground';

// Reads the current value of a number or an interpolation.
const valueOf = (v: number | Animated.AnimatedInterpolation<number>): number =>
  typeof v === 'number' ? v : (v as unknown as { __getValue(): number }).__getValue();

/**
 * Composites the stacked layers bottom to top and returns how much each layer
 * contributes to the final pixel.
 */
const compositeWeights = (progress: Animated.Value, n: number): number[] => {
  let weights = new Array<number>(n).fill(0);
  for (let j = 0; j < n; j++) {
    const alpha = valueOf(layerOpacity(progress, j, n));
    weights = weights.map((w) => w * (1 - alpha));
    weights[j] += alpha;
  }
  return weights;
};

describe('layerOpacity', () => {
  it.each([2, 3, 4, 7])(
    'with %i colors, matches an exact blend between neighbouring layers',
    (n) => {
      const progress = new Animated.Value(0);
      for (let step = 0; step <= 400; step++) {
        const v = (step / 400) * n;
        // Skip the 0.001-wide hand-off right after layer n-1 is fully opaque.
        if (v > n - 1 && v < n - 1 + 0.001) continue;
        progress.setValue(v);

        const k = Math.min(Math.floor(v), n - 1);
        const t = v - k;
        const expected = new Array<number>(n).fill(0);
        expected[k] += 1 - t;
        expected[(k + 1) % n] += t;

        compositeWeights(progress, n).forEach((w, i) => {
          expect(w).toBeCloseTo(expected[i], 6);
        });
      }
    },
  );

  it('keeps the bottom layer opaque', () => {
    expect(layerOpacity(new Animated.Value(0.5), 0, 3)).toBe(1);
  });
});
