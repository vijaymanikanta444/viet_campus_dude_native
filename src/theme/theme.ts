import { TextStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  success: string;
  danger: string;
};

export type TypographyVariant = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
};

export type ThemeTypography = {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  variants: {
    title: TypographyVariant;
    body: TypographyVariant;
    caption: TypographyVariant;
  };
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
};

const baseTheme = {
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    variants: {
      title: {
        fontFamily: 'System',
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '700' as TextStyle['fontWeight'],
        letterSpacing: -0.3,
      },
      body: {
        fontFamily: 'System',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as TextStyle['fontWeight'],
      },
      caption: {
        fontFamily: 'System',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '400' as TextStyle['fontWeight'],
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 18,
  },
} as const;

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF1F8',
    border: '#D7DEEA',
    textPrimary: '#111827',
    textMuted: '#5A6475',
    primary: '#0C66E4',
    primaryText: '#FFFFFF',
    success: '#1F845A',
    danger: '#C9372C',
  },
  typography: baseTheme.typography,
  spacing: baseTheme.spacing,
  radius: baseTheme.radius,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#10141C',
    surface: '#161B25',
    surfaceAlt: '#1E2533',
    border: '#2A3447',
    textPrimary: '#E6EBF5',
    textMuted: '#A6B0C2',
    primary: '#66A9FF',
    primaryText: '#0B1220',
    success: '#5AC08F',
    danger: '#F4867B',
  },
  typography: baseTheme.typography,
  spacing: baseTheme.spacing,
  radius: baseTheme.radius,
};
