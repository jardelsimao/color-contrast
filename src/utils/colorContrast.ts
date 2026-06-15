/**
 * WCAG 2.1 relative luminance — the gold standard for accessible contrast.
 * Converts sRGB 0-255 channel to linear, then weights per human perception.
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const linearize = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Contrast ratio between two luminances. Range: 1 (identical) to 21 (black/white). */
function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const WHITE_LUM = 1.0;
const BLACK_LUM = 0.0;

/**
 * Given an RGB background color (0-255 each), returns either "#000000" or "#FFFFFF"
 * — whichever yields the higher WCAG contrast ratio.
 */
export function contrastForeground(
  r: number,
  g: number,
  b: number,
): "#000000" | "#FFFFFF" {
  return needsLightForeground(r, g, b) ? "#FFFFFF" : "#000000";
}

/**
 * Returns true when the background is dark enough that light (white) text
 * yields better contrast than dark (black) text.
 */
export function needsLightForeground(r: number, g: number, b: number): boolean {
  const bgLum = relativeLuminance(r, g, b);
  const ratioWhite = contrastRatio(WHITE_LUM, bgLum);
  const ratioBlack = contrastRatio(bgLum, BLACK_LUM);
  return ratioWhite > ratioBlack;
}

/** Human-readable luminance category. */
export function luminanceLabel(lum: number): string {
  if (lum < 0.1) return "Very dark";
  if (lum < 0.3) return "Dark";
  if (lum < 0.6) return "Medium";
  if (lum < 0.85) return "Light";
  return "Very light";
}

/** Parse any CSS color-like string into {r,g,b} or null. */
export function parseColor(
  input: string,
): { r: number; g: number; b: number } | null {
  // hex
  const hex = input.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hex) {
    return {
      r: parseInt(hex[1], 16),
      g: parseInt(hex[2], 16),
      b: parseInt(hex[3], 16),
    };
  }
  // rgb / rgba
  const rgb = input.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };
  }
  return null;
}

export { relativeLuminance, contrastRatio };
