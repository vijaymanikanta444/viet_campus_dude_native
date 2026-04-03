import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { ThemedCard, ThemedText } from '../components';
import { SafeAreaScreen } from '../layout';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

type PlaceholderRouteParams = {
  title: string;
  subtitle?: string;
};

type PlaceholderRoute = RouteProp<
  { PlaceholderDetails: PlaceholderRouteParams },
  'PlaceholderDetails'
>;

export function PlaceholderDetailsScreen() {
  const styles = useThemedStyles(createStyles);
  const route = useRoute<PlaceholderRoute>();

  const title = useMemo(
    () => route.params?.title ?? 'Coming Soon',
    [route.params?.title],
  );
  const subtitle = useMemo(
    () => route.params?.subtitle ?? 'This module will be available soon.',
    [route.params?.subtitle],
  );

  return (
    <SafeAreaScreen style={styles.container} contentStyle={styles.content}>
      <ThemedText variant="title">{title}</ThemedText>

      <ThemedCard>
        <ThemedText variant="body" color="textMuted">
          {subtitle}
        </ThemedText>
      </ThemedCard>
    </SafeAreaScreen>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
});