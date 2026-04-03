import { ActivityIndicator, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme, useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';
import { ThemedText } from './ThemedText';

type ThemedLoaderProps = {
  visible?: boolean;
  size?: 'small' | 'large';
  message?: string;
  style?: StyleProp<ViewStyle>;
};

export function ThemedLoader({
  visible = true,
  size = 'large',
  message,
  style,
}: ThemedLoaderProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && (
          <ThemedText variant="body" style={styles.message}>
            {message}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loaderBox: {
    gap: theme.spacing.md,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
  message: {
    textAlign: 'center' as const,
  },
});
