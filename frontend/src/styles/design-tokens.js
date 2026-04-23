/**
 * CodeKids Design System
 * Color Scheme: #399aff (Primary Blue) + Grayscale
 * Professional monochromatic design with single accent color
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // Primary Brand Color
  primary: '#399aff',
  primaryLight: '#e8f3ff',      // Light background tint
  primaryLighter: '#f0f8ff',    // Very light background
  primaryDark: '#1e7de8',       // Hover/pressed state
  primaryDarker: '#1565c0',     // Active state
  primaryMuted: 'rgba(57, 154, 255, 0.1)',  // Subtle overlay

  // Status Colors (for alerts, badges, etc.)
  success: '#10b981',           // Green
  warning: '#f59e0b',           // Amber
  danger: '#ef4444',            // Red
  info: '#399aff',              // Uses primary

  // Grayscale Palette (light to dark)
  gray: {
    0: '#ffffff',               // Pure white
    50: '#f9fafb',              // Almost white
    100: '#f3f4f6',             // Very light gray
    150: '#eeeff3',             // Light gray
    200: '#e5e7eb',             // Light gray
    300: '#d1d5db',             // Gray
    400: '#9ca3af',             // Medium gray
    500: '#6b7280',             // Gray
    600: '#4b5563',             // Dark gray
    700: '#374151',             // Darker gray
    800: '#1f2937',             // Very dark gray
    900: '#111827',             // Near black
    950: '#0f172a',             // Almost black
  },

  // Semantic Colors
  background: '#ffffff',
  backgroundAlt: '#f9fafb',
  backgroundHover: '#f3f4f6',
  text: '#0f172a',              // Near black
  textSecondary: '#64748b',     // Gray
  textTertiary: '#9ca3af',      // Lighter gray
  textInverse: '#ffffff',       // White text on dark
  border: '#e2e8f0',            // Light border
  borderLight: '#f1f5f9',       // Very light border
  divider: '#e5e7eb',           // Divider color

  // State Colors
  disabled: '#d1d5db',
  disabledText: '#9ca3af',
  focus: '#399aff',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Monaco', 'Courier New', monospace",
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

// ============================================
// SPACING
// ============================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
};

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Colored shadows
  primarySm: '0 2px 4px rgba(57, 154, 255, 0.2)',
  primaryMd: '0 4px 12px rgba(57, 154, 255, 0.3)',
  primaryLg: '0 8px 24px rgba(57, 154, 255, 0.4)',
};

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
  slowest: '500ms ease-in-out',

  // Specific transitions
  color: 'color 250ms ease-in-out',
  bg: 'background-color 250ms ease-in-out',
  border: 'border-color 250ms ease-in-out',
  shadow: 'box-shadow 250ms ease-in-out',
  transform: 'transform 250ms ease-in-out',
};

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  offcanvas: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '0px',
  sm: '640px',   // Small mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px', // Ultra-wide
};

// Media query helpers
export const media = {
  xs: `@media (min-width: 0px)`,
  sm: `@media (min-width: 640px)`,
  md: `@media (min-width: 768px)`,
  lg: `@media (min-width: 1024px)`,
  xl: `@media (min-width: 1280px)`,
  '2xl': `@media (min-width: 1536px)`,
  // Mobile-first (max-width)
  xsOnly: `@media (max-width: 639px)`,
  smOnly: `@media (max-width: 767px)`,
  mdOnly: `@media (max-width: 1023px)`,
};

// ============================================
// COMPONENTS
// ============================================

export const components = {
  button: {
    primary: {
      bg: colors.primary,
      bgHover: colors.primaryDark,
      bgActive: colors.primaryDarker,
      text: '#ffffff',
      border: 'transparent',
    },
    secondary: {
      bg: colors.gray[100],
      bgHover: colors.gray[200],
      text: colors.text,
      border: colors.border,
    },
    outline: {
      bg: 'transparent',
      bgHover: colors.primaryLight,
      text: colors.primary,
      border: colors.primary,
    },
    ghost: {
      bg: 'transparent',
      bgHover: colors.gray[100],
      text: colors.text,
      border: 'transparent',
    },
    disabled: {
      bg: colors.gray[100],
      text: colors.textTertiary,
      border: colors.border,
    },
  },

  input: {
    bg: colors.gray[0],
    bgDisabled: colors.gray[100],
    border: colors.border,
    borderFocus: colors.primary,
    text: colors.text,
    textDisabled: colors.textTertiary,
    placeholder: colors.textTertiary,
  },

  card: {
    bg: colors.gray[0],
    bgAlt: colors.gray[50],
    border: colors.border,
    shadow: shadows.sm,
  },
};

// ============================================
// DARK MODE OVERRIDES
// ============================================

export const darkModeColors = {
  background: '#0f172a',
  backgroundAlt: '#1e293b',
  backgroundHover: '#334155',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  border: '#334155',
  divider: '#475569',
};

// ============================================
// EXPORT COMPLETE THEME
// ============================================

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  zIndex,
  breakpoints,
  media,
  components,
  darkModeColors,
};

export default theme;
