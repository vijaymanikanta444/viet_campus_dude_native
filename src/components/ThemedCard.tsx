import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme, useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';
import { ReactNode } from 'react';

type ThemedCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'outlined' | 'elevated';
};

export function ThemedCard({
  children,
  style,
  variant = 'default',
}: ThemedCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.cardOutlined;
      case 'elevated':
        return styles.cardElevated;
      case 'default':
      default:
        return styles.cardDefault;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), style]}>{children}</View>
  );
}

const createStyles = (theme: Theme) => ({
  card: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardOutlined: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardElevated: {
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
