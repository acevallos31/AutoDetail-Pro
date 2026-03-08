/**
 * Design Tokens - AutoDetail Pro (Updated from Figma)
 * Professional dark-to-light color scheme with blue-cyan accents
 */

export const colors = {
  // Primary - Azul-Cyan (acentos principales)
  primary: '#0284c7', // sky blue
  primaryLight: '#38bdf8',
  primaryDark: '#0369a1',
  
  // Accent - Cyan (complementario)
  accent: '#06b6d4',
  accentLight: '#22d3ee',
  accentDark: '#0891b2',
  
  // Sidebar - Gradiente oscuro (slate)
  sidebarDark: '#0f172a',    // slate-900
  sidebarLight: '#1e293b',   // slate-800
  
  // Fondo
  background: '#ffffff',
  backgroundLight: '#f8fafc', // slate-50
  backgroundLighter: '#f1f5f9', // slate-100
  
  // Text
  textDark: '#0f172a',         // slate-900
  textLight: '#475569',        // slate-600
  textMuted: '#94a3b8',        // slate-400
  textWhite: '#ffffff',
  
  // Borders & UI
  border: '#e2e8f0',           // slate-200
  borderLight: '#f1f5f9',      // slate-100
  borderDark: '#cbd5e1',       // slate-300
  
  // Success
  success: '#10b981',
  successLight: '#6ee7b7',
  successBg: '#ecfdf5',
  
  // Warning
  warning: '#f59e0b',
  warningLight: '#fcd34d',
  warningBg: '#fffbeb',
  
  // Error
  error: '#ef4444',
  errorLight: '#fca5a5',
  errorBg: '#fef2f2',
  
  // Info
  info: '#3b82f6',
  infoLight: '#93c5fd',
  infoBg: '#eff6ff',

  // Chart colors (for analytics)
  chart: {
    1: '#f59e0b', // amber
    2: '#3b82f6', // blue
    3: '#8b5cf6', // violet
    4: '#ec4899', // pink
    5: '#06b6d4', // cyan
  }
};

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

export const typography = {
  fontFamily: {
    display: "'Outfit', 'Segoe UI', sans-serif",
    body: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.65,
  },
};

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 14px 30px -12px rgba(15, 23, 42, 0.18), 0 6px 12px -8px rgba(15, 23, 42, 0.14)',
  xl: '0 26px 40px -18px rgba(15, 23, 42, 0.26), 0 14px 20px -12px rgba(15, 23, 42, 0.18)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  blue: '0 0 20px rgba(3, 132, 199, 0.3)',
  glow: '0 10px 35px -10px rgba(2, 132, 199, 0.42)',
};

export const transitions = {
  fast: 'all 150ms ease-in-out',
  base: 'all 200ms ease-in-out',
  slow: 'all 300ms ease-in-out',
  colors: 'color 200ms ease-in-out, background-color 200ms ease-in-out',
};

export const sizes = {
  sidebarWidth: '288px',
  sidebarWidthCollapsed: '80px',
  headerHeight: '64px',
  maxContentWidth: '1400px',
};

export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  sizes,
};

export default designTokens;
