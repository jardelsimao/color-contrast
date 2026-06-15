import { useMemo, type CSSProperties, type ReactNode } from "react";
import {
  contrastForeground,
  needsLightForeground,
  parseColor,
} from "../utils/colorContrast";

interface ContrastTextProps {
  /** Background color — hex (#ff0000, ff0000), rgb(255,0,0), etc. */
  bgColor: string;
  /** Content to render. Falls back to displaying the color value. */
  children?: ReactNode;
  /** Extra inline styles applied to the wrapper div. */
  style?: CSSProperties;
  /** Extra class name applied to the wrapper div. */
  className?: string;
  /**
   * Optional CSS class for light text on dark backgrounds.
   * When both lightClass and darkClass are set, the component uses
   * theme classes instead of inline #FFF / #000.
   */
  lightClass?: string;
  /**
   * Optional CSS class for dark text on light backgrounds.
   * When both lightClass and darkClass are set, the component uses
   * theme classes instead of inline #FFF / #000.
   */
  darkClass?: string;
}

/**
 * A wrapper that automatically picks the right foreground for its background:
 * - By default: inline #FFFFFF or #000000 (WCAG contrast ratio).
 * - With theme classes: applies lightClass or darkClass instead.
 *
 * @example
 * // Inline colors (default)
 * <ContrastText bgColor="#ff6b6b">Hello</ContrastText>
 *
 * @example
 * // Theme-aware — e.g. Tailwind:
 * <ContrastText
 *   bgColor="#1e1e2e"
 *   lightClass="text-white"
 *   darkClass="text-gray-900"
 * />
 */
export function ContrastText({
  bgColor,
  children,
  style,
  className,
  lightClass,
  darkClass,
}: ContrastTextProps) {
  const parsed = parseColor(bgColor);

  const foreground = useMemo(() => {
    if (!parsed) return "#000";
    return contrastForeground(parsed.r, parsed.g, parsed.b);
  }, [parsed]);

  const useLight = useMemo(() => {
    if (!parsed) return false;
    return needsLightForeground(parsed.r, parsed.g, parsed.b);
  }, [parsed]);

  const hasThemeClasses = lightClass != null && darkClass != null;

  const boxStyle: CSSProperties = {
    backgroundColor: bgColor,
    // Only inject inline color when no theme classes are provided
    ...(!hasThemeClasses && { color: foreground }),
    padding: "1rem 1.5rem",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    transition: "background-color 0.3s, color 0.3s",
    minHeight: 48,
    ...style,
  };

  const resolvedClassName = [
    className,
    hasThemeClasses ? (useLight ? lightClass : darkClass) : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={resolvedClassName || undefined} style={boxStyle}>
      {children ?? bgColor}
    </div>
  );
}
