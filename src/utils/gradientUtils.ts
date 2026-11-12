import { getDefaultGradients } from './themeDefaults';

type Point = { x: number; y: number };

/**
 * Converts an angle in degrees into LinearGradient start/end points.
 * When no angle is given, keeps the 1.0.x fallback so existing layouts render the same.
 */
export const angleToDirection = (angle?: number): { start: Point; end: Point } => {
  if (angle === undefined) {
    return { start: { x: 0, y: 1 }, end: { x: 0, y: 1 } };
  }
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians);
  const y = Math.sin(radians);
  return {
    start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
    end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
  };
};

interface SideGradients {
  borderGradient?: string[];
  borderTopGradient?: string[];
  borderBottomGradient?: string[];
  borderLeftGradient?: string[];
  borderRightGradient?: string[];
}

export const shouldUseIndividualBorders = ({
  borderGradient,
  borderTopGradient,
  borderBottomGradient,
  borderLeftGradient,
  borderRightGradient,
}: SideGradients): boolean => {
  if (borderGradient) {
    return false;
  }

  const individualBorderCount = [
    borderTopGradient,
    borderBottomGradient,
    borderLeftGradient,
    borderRightGradient,
  ].filter(Boolean).length;

  if (individualBorderCount <= 2) {
    return true;
  }

  const hasVertical = borderTopGradient || borderBottomGradient;
  const hasHorizontal = borderLeftGradient || borderRightGradient;
  return !(hasVertical && hasHorizontal);
};

const evenLocations = (count: number): number[] =>
  count <= 1 ? [0] : Array.from({ length: count }, (_, i) => i / (count - 1));

export const getFullBorderGradient = ({
  borderGradient,
  borderTopGradient,
  borderBottomGradient,
  borderLeftGradient,
  borderRightGradient,
  borderLocations,
  isDark,
}: SideGradients & { borderLocations?: number[]; isDark: boolean }): {
  colors: string[];
  locations: number[];
} => {
  if (borderGradient && borderGradient.length > 0) {
    return {
      colors: borderGradient,
      locations:
        borderLocations && borderLocations.length === borderGradient.length
          ? borderLocations
          : evenLocations(borderGradient.length),
    };
  }

  if (!borderTopGradient && !borderBottomGradient && !borderLeftGradient && !borderRightGradient) {
    return {
      colors: getDefaultGradients(isDark ? 'dark' : 'light').border,
      locations: [0, 1],
    };
  }

  // Walk the sides clockwise starting from the right, matching 1.0.x behaviour.
  const colors: string[] = [
    ...(borderRightGradient ?? []),
    ...(borderBottomGradient ?? []),
    ...(borderLeftGradient ?? []),
    ...(borderTopGradient ?? []),
  ];

  // LinearGradient needs at least two colors.
  if (colors.length === 1) {
    colors.push(colors[0]);
  }

  return { colors, locations: evenLocations(colors.length) };
};

/**
 * Builds a localized border highlight for perimeter sweep rotation.
 * Most of the ring is transparent so a short bright segment travels around
 * the control as the layer spins — like one edge running around the button.
 */
export const buildBorderSweepGradient = (
  colors: string[],
  span = 0.22,
): { colors: string[]; locations: number[] } => {
  const highlight = colors[0] ?? '#ffffff';
  const mid = colors[1] ?? highlight;
  const clear = 'rgba(0,0,0,0)';
  const s = Math.min(0.8, Math.max(0.05, span));

  return {
    colors: [clear, mid, highlight, mid, clear, clear],
    locations: [0, s * 0.35, s * 0.5, s * 0.65, s, 1],
  };
};

/**
 * Fully transparent version of a color. Fading to the same hue avoids the dark
 * fringe you get when fading to transparent black on iOS and Android.
 */
export const toTransparent = (color: string): string => {
  const c = color.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(c);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }
    return `#${h.slice(0, 6)}00`;
  }
  const rgb = /^rgba?\(([^,]+),([^,]+),([^,)]+)/i.exec(c);
  if (rgb) {
    return `rgba(${rgb[1].trim()},${rgb[2].trim()},${rgb[3].trim()},0)`;
  }
  return 'transparent';
};

/**
 * The sweep highlight: a strip from the centre of the rotating border layer
 * out to its edge. Wherever the layer has turned, the strip crosses the border
 * ring at exactly one point, so a single highlight travels around the whole
 * control (a conic-gradient look built from a linear gradient).
 *
 * `span` is roughly the share of the perimeter the highlight covers.
 * Returns null until the control has been measured.
 */
export const getSweepRay = (
  colors: string[],
  span: number,
  width: number,
  height: number,
  borderWidth = 0,
): {
  colors: string[];
  locations: number[];
  style: { position: 'absolute'; top: number; left: number; width: number; height: number };
} | null => {
  if (width <= 0 || height <= 0) return null;

  const d = Math.ceil(Math.sqrt(width * width + height * height));
  const s = Math.min(0.8, Math.max(0.05, span));
  // Half the perimeter is width + height; the soft edges make the bright part look about half as wide.
  // Cap the width so the strip's base near the centre stays inside the inner area,
  // where the background hides it; otherwise it lights the opposite edge too.
  const maxWidth = Math.max(4, Math.min(width, height) - 2 * borderWidth);
  const rayWidth = Math.min(maxWidth, Math.max(4, s * (width + height)));
  const highlight = colors[0] ?? '#ffffff';
  const mid = colors[1] ?? highlight;

  return {
    colors: [toTransparent(mid), mid, highlight, mid, toTransparent(mid)],
    locations: [0, 0.25, 0.5, 0.75, 1],
    style: {
      position: 'absolute',
      top: 0,
      left: (d - rayWidth) / 2,
      width: rayWidth,
      height: d / 2,
    },
  };
};

/**
 * Style for a layer that rotates inside a w×h box. The layer is a square the
 * size of the box's diagonal, centred, so the corners stay covered at every angle.
 */
export const getRotatingLayerStyle = (w: number, h: number) => {
  if (w <= 0 || h <= 0) {
    return { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
  }
  const d = Math.ceil(Math.sqrt(w * w + h * h));
  return {
    position: 'absolute' as const,
    width: d,
    height: d,
    left: (w - d) / 2,
    top: (h - d) / 2,
  };
};
