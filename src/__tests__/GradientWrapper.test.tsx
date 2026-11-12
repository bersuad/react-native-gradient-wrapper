import { Text, View, StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { createGradientWrapper } from '../core/createGradientWrapper';

// Stands in for expo-linear-gradient / react-native-linear-gradient.
const MockGradient = (props: Record<string, unknown>) => <View testID="gradient" {...props} />;
const GradientWrapper = createGradientWrapper(MockGradient);

const gradients = () => screen.getAllByTestId('gradient');
const colorsOf = (el: { props: Record<string, unknown> }) => el.props.colors;

describe('GradientWrapper', () => {
  it('renders its children', async () => {
    await render(
      <GradientWrapper>
        <Text>Hello</Text>
      </GradientWrapper>,
    );
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  it('defaults to a 10px radius and does not force a size', async () => {
    await render(
      <GradientWrapper>
        <Text>Card</Text>
      </GradientWrapper>,
    );
    const style = StyleSheet.flatten(screen.root?.props.style);
    expect(style.borderRadius).toBe(10);
    expect(style.width).toBeUndefined();
    expect(style.height).toBeUndefined();
  });

  it('merges the style prop over the defaults', async () => {
    await render(
      <GradientWrapper style={{ borderRadius: 4, margin: 8 }}>
        <Text>Card</Text>
      </GradientWrapper>,
    );
    const style = StyleSheet.flatten(screen.root?.props.style);
    expect(style.borderRadius).toBe(4);
    expect(style.margin).toBe(8);
  });

  it('uses theme defaults when no gradients are given', async () => {
    await render(
      <GradientWrapper theme="dark" borderGradient={['#111', '#222']}>
        <Text>Dark</Text>
      </GradientWrapper>,
    );
    const [border, background] = gradients();
    expect(colorsOf(border)).toEqual(['#111', '#222']);
    expect(colorsOf(background)).toEqual(['#2c3e50', '#1a1a1a']);
  });

  it('renders one crossfade layer per color when animated', async () => {
    await render(
      <GradientWrapper
        animated
        borderGradient={['#000', '#fff']}
        backgroundGradient={['red', 'green', 'blue']}
      >
        <Text>Animated</Text>
      </GradientWrapper>,
    );
    const [, ...layers] = gradients();
    expect(layers.map(colorsOf)).toEqual([
      ['red', 'green'],
      ['green', 'blue'],
      ['blue', 'red'],
    ]);
  });

  it('only passes two-stop locations to animated layers', async () => {
    await render(
      <GradientWrapper
        animated
        borderGradient={['#000', '#fff']}
        backgroundGradient={['red', 'blue']}
        backgroundLocations={[0, 0.6, 1]}
      >
        <Text>Animated</Text>
      </GradientWrapper>,
    );
    const [, ...layers] = gradients();
    layers.forEach((layer) => expect(layer.props.locations).toBeUndefined());
  });

  it('draws per-side borders when only some sides are set', async () => {
    await render(
      <GradientWrapper borderTopGradient={['#f00', '#0f0']}>
        <Text>Top</Text>
      </GradientWrapper>,
    );
    const [top] = gradients();
    expect(colorsOf(top)).toEqual(['#f00', '#0f0']);
    expect(StyleSheet.flatten(top.props.style)).toMatchObject({
      position: 'absolute',
      top: 0,
      width: '95%',
    });
  });

  it('sizes a rotating border layer to the diagonal after layout', async () => {
    await render(
      <GradientWrapper borderGradient={['#f00', '#00f']} borderRotation="clockwise">
        <Text>Spin</Text>
      </GradientWrapper>,
    );
    await fireEvent(screen.root!, 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 100 } },
    });
    const [border] = gradients();
    expect(StyleSheet.flatten(border.parent?.props.style)).toMatchObject({
      width: 317,
      height: 317,
      left: -8.5,
      top: -108.5,
    });
  });

  it('calls onPress and is not pressable without handlers', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      <GradientWrapper onPress={onPress}>
        <Text>Tap</Text>
      </GradientWrapper>,
    );
    await fireEvent.press(screen.getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(
      <GradientWrapper>
        <Text>Tap</Text>
      </GradientWrapper>,
    );
    expect(screen.root?.props.onLayout).toBeDefined();
    expect(screen.root?.props.onClick).toBeUndefined();
  });

  describe('stopBorderAfter', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('stops the spin and falls back to a static border', async () => {
      await render(
        <GradientWrapper
          borderGradient={['#f00', '#00f']}
          borderRotation="clockwise"
          borderRotationSpeed={1000}
          stopBorderAfter={2500}
        >
          <Text>Spin</Text>
        </GradientWrapper>,
      );
      const spinning = () =>
        StyleSheet.flatten(gradients()[0].parent?.props.style).transform !== undefined;

      expect(spinning()).toBe(true);

      // 2.5s of spinning, then the rest of the current turn.
      await act(async () => {
        jest.advanceTimersByTime(4000);
      });

      expect(spinning()).toBe(false);
      expect(colorsOf(gradients()[0])).toEqual(['#f00', '#00f']);
    });
  });
});
