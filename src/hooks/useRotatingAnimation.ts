import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { RotationDirection } from '../types';

interface UseRotatingAnimationProps {
  rotation: RotationDirection;
  /** Duration of one full turn, in ms. */
  rotationSpeed: number;
  animRef: Animated.Value;
  /** Stop after this many ms. The current turn finishes so the layer comes to rest at 0°. */
  stopAfter?: number;
  onStop?: () => void;
}

/**
 * Drives animRef in whole turns (0 → 1 → 2 → …) at a constant speed.
 * Map with interpolate([0, 1] → ['0deg', '360deg']) and let it extrapolate.
 *
 * Accumulating turns (instead of looping 0→1 with a reset) is required on web:
 * CSS treats rotate(0deg) and rotate(360deg) as identical, so a reset loop
 * produces no visible motion.
 */
export const useRotatingAnimation = ({
  rotation,
  rotationSpeed,
  animRef,
  stopAfter,
  onStop,
}: UseRotatingAnimationProps) => {
  // Keep the latest callback without restarting the animation when it changes.
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  useEffect(() => {
    if (rotation === 'none') return;

    const duration = Math.max(1, rotationSpeed);
    let cancelled = false;
    let turn = 0;
    let current: Animated.CompositeAnimation | undefined;

    animRef.setValue(0);

    const runTurn = () => {
      if (cancelled) return;
      turn += 1;
      current = Animated.timing(animRef, {
        toValue: turn,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      current.start(({ finished }) => {
        if (finished && !cancelled) runTurn();
      });
    };

    runTurn();

    const finishCurrentTurn = (value: number) => {
      if (cancelled) return;
      const target = Number.isInteger(value) ? value + 1 : Math.ceil(value);
      current = Animated.timing(animRef, {
        toValue: target,
        duration: Math.max(1, (target - value) * duration),
        easing: Easing.linear,
        useNativeDriver: true,
      });
      current.start(({ finished }) => {
        if (cancelled || !finished) return;
        onStopRef.current?.();
      });
    };

    const timeoutId =
      stopAfter === undefined
        ? undefined
        : setTimeout(() => {
            current?.stop();
            animRef.stopAnimation(finishCurrentTurn);
          }, stopAfter);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      current?.stop();
    };
  }, [rotation, rotationSpeed, stopAfter, animRef]);
};
