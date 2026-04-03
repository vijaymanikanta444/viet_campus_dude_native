import { ReactNode } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { ThemeColors, ThemeTypography, useTheme } from '../theme';

type TextVariant = keyof ThemeTypography['variants'];

type ThemedTextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  color?: keyof ThemeColors;
};

export function ThemedText({
  children,
  style,
  variant = 'body',
  color = 'textPrimary',
}: ThemedTextProps) {
  const { theme } = useTheme();
  const variantStyle = theme.typography.variants[variant];

  return (
    <Text style={[{ color: theme.colors[color] }, variantStyle, style]}>
      {children}
    </Text>
  );
}
