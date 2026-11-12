import {
  angleToDirection,
  buildBorderSweepGradient,
  getFullBorderGradient,
  getRotatingLayerStyle,
  getSweepRay,
  shouldUseIndividualBorders,
  toTransparent,
} from '../utils/gradientUtils';
import { getDefaultGradients } from '../utils/themeDefaults';

const round = (p: { x: number; y: number }) => ({
  x: Math.round(p.x * 1000) / 1000,
  y: Math.round(p.y * 1000) / 1000,
});

describe('angleToDirection', () => {
  it('keeps the 1.0.x fallback when no angle is given', () => {
    expect(angleToDirection()).toEqual({ start: { x: 0, y: 1 }, end: { x: 0, y: 1 } });
  });

  it.each([
    [0, { x: 0, y: 0.5 }, { x: 1, y: 0.5 }],
    [90, { x: 0.5, y: 0 }, { x: 0.5, y: 1 }],
    [180, { x: 1, y: 0.5 }, { x: 0, y: 0.5 }],
  ])('maps %i degrees to start/end points', (angle, start, end) => {
    const d = angleToDirection(angle);
    expect(round(d.start)).toEqual(start);
    expect(round(d.end)).toEqual(end);
  });
});

describe('shouldUseIndividualBorders', () => {
  it('is false when a full border gradient is given', () => {
    expect(
      shouldUseIndividualBorders({ borderGradient: ['#000', '#fff'], borderTopGradient: ['#f00'] }),
    ).toBe(false);
  });

  it('is true for up to two sides', () => {
    expect(shouldUseIndividualBorders({ borderTopGradient: ['#f00', '#0f0'] })).toBe(true);
    expect(
      shouldUseIndividualBorders({ borderTopGradient: ['#f00'], borderLeftGradient: ['#00f'] }),
    ).toBe(true);
  });

  it('is false for three or more sides spanning both axes', () => {
    expect(
      shouldUseIndividualBorders({
        borderTopGradient: ['#f00'],
        borderBottomGradient: ['#0f0'],
        borderLeftGradient: ['#00f'],
      }),
    ).toBe(false);
  });

  it('is true when nothing is set', () => {
    expect(shouldUseIndividualBorders({})).toBe(true);
  });
});

describe('getFullBorderGradient', () => {
  it('spaces locations evenly when borderLocations is missing', () => {
    expect(
      getFullBorderGradient({ borderGradient: ['a', 'b', 'c'], isDark: false }).locations,
    ).toEqual([0, 0.5, 1]);
  });

  it('uses borderLocations when the length matches', () => {
    expect(
      getFullBorderGradient({
        borderGradient: ['a', 'b'],
        borderLocations: [0.2, 0.8],
        isDark: false,
      }).locations,
    ).toEqual([0.2, 0.8]);
  });

  it('ignores borderLocations when the length does not match', () => {
    expect(
      getFullBorderGradient({ borderGradient: ['a', 'b'], borderLocations: [0], isDark: false })
        .locations,
    ).toEqual([0, 1]);
  });

  it('falls back to theme defaults', () => {
    expect(getFullBorderGradient({ isDark: true }).colors).toEqual(['#4b6cb7', '#182848']);
    expect(getFullBorderGradient({ isDark: false }).colors).toEqual(['#ccc', '#eee']);
  });

  it('joins sides clockwise from the right', () => {
    expect(
      getFullBorderGradient({
        borderTopGradient: ['top'],
        borderRightGradient: ['right'],
        borderBottomGradient: ['bottom'],
        borderLeftGradient: ['left'],
        isDark: false,
      }).colors,
    ).toEqual(['right', 'bottom', 'left', 'top']);
  });

  it('always returns at least two colors', () => {
    const result = getFullBorderGradient({ borderTopGradient: ['#f00'], isDark: false });
    expect(result.colors).toEqual(['#f00', '#f00']);
    expect(result.locations).toEqual([0, 1]);
  });
});

describe('buildBorderSweepGradient', () => {
  it('builds a short highlight with transparent ring elsewhere', () => {
    const result = buildBorderSweepGradient(['#00e5ff', '#7b61ff'], 0.2);
    expect(result.colors[0]).toBe('rgba(0,0,0,0)');
    expect(result.colors[2]).toBe('#00e5ff');
    expect(result.locations[0]).toBe(0);
    expect(result.locations[result.locations.length - 1]).toBe(1);
    expect(result.locations[4]).toBe(0.2);
  });
});

describe('toTransparent', () => {
  it.each([
    ['#00e5ff', '#00e5ff00'],
    ['#abc', '#aabbcc00'],
    ['#abcd', '#aabbcc00'],
    ['#11223344', '#11223300'],
    ['rgb(10, 20, 30)', 'rgba(10,20,30,0)'],
    ['rgba(10,20,30,0.5)', 'rgba(10,20,30,0)'],
    ['red', 'transparent'],
  ])('%s -> %s', (input, expected) => {
    expect(toTransparent(input)).toBe(expected);
  });
});

describe('getSweepRay', () => {
  it('returns null before layout', () => {
    expect(getSweepRay(['#0ff', '#70f'], 0.2, 0, 0)).toBeNull();
  });

  it('runs from the top edge of the rotating layer to its centre', () => {
    // 300x100 -> diagonal 317
    const ray = getSweepRay(['#00e5ff', '#7b61ff'], 0.2, 300, 100, 2)!;
    expect(ray.style.top).toBe(0);
    expect(ray.style.height).toBe(317 / 2);
    expect(ray.style.left + ray.style.width / 2).toBeCloseTo(317 / 2);
  });

  it('fades from a transparent highlight color to the highlight and back', () => {
    const ray = getSweepRay(['#00e5ff', '#7b61ff'], 0.2, 300, 100)!;
    expect(ray.colors).toEqual(['#7b61ff00', '#7b61ff', '#00e5ff', '#7b61ff', '#7b61ff00']);
    expect(ray.locations).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('scales the width with span', () => {
    const narrow = getSweepRay(['#fff'], 0.1, 600, 600)!;
    const wide = getSweepRay(['#fff'], 0.3, 600, 600)!;
    expect(narrow.style.width).toBe(120);
    expect(wide.style.width).toBe(360);
  });

  it('stays narrower than the inner area so it cannot light the opposite edge', () => {
    // span would ask for 0.5 * (260 + 56) = 158px; the inner height is 56 - 2 * 3 = 50.
    expect(getSweepRay(['#fff'], 0.5, 260, 56, 3)!.style.width).toBe(50);
  });
});

describe('getRotatingLayerStyle', () => {
  it('fills the parent before layout', () => {
    expect(getRotatingLayerStyle(0, 0)).toEqual({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });
  });

  it('is a centred square the size of the diagonal', () => {
    // sqrt(300^2 + 100^2) = 316.23 -> 317
    expect(getRotatingLayerStyle(300, 100)).toEqual({
      position: 'absolute',
      width: 317,
      height: 317,
      left: -8.5,
      top: -108.5,
    });
  });
});

describe('getDefaultGradients', () => {
  it('follows the explicit theme', () => {
    expect(getDefaultGradients('dark').background).toEqual(['#2c3e50', '#1a1a1a']);
    expect(getDefaultGradients('light', 'dark').background).toEqual(['#ffffff', '#f2f2f2']);
  });

  it('follows the system theme in auto mode, treating null as light', () => {
    expect(getDefaultGradients('auto', 'dark').background).toEqual(['#2c3e50', '#1a1a1a']);
    expect(getDefaultGradients('auto', null).background).toEqual(['#ffffff', '#f2f2f2']);
  });
});
