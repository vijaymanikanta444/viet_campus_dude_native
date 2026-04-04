import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { ThemedCard, ThemedText } from '../components';
import { SafeAreaScreen } from '../layout';
import type { ProfileStackParamList } from '../navigation/types';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

type ProfileSectionRoute = RouteProp<ProfileStackParamList, 'ProfileSection'>;

export function ProfileSectionScreen() {
  const styles = useThemedStyles(createStyles);
  const route = useRoute<ProfileSectionRoute>();

  const { title, subtitle, items } = route.params;

  const resolvedSubtitle = useMemo(
    () => subtitle ?? 'View and manage settings for this section.',
    [subtitle],
  );

  return (
    <SafeAreaScreen style={styles.container} contentStyle={styles.content}>
      <ThemedText variant="title">{title}</ThemedText>
      <ThemedText variant="body" color="textMuted">
        {resolvedSubtitle}
      </ThemedText>

      <ThemedCard style={styles.card}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <ThemedCard
              key={item.label + index}
              style={[styles.row, isLast && styles.lastRow]}
            >
              <ThemedText variant="body" style={styles.rowLabel}>
                {item.label}
              </ThemedText>
              {item.value ? (
                <ThemedText
                  variant="body"
                  color="textMuted"
                  style={styles.rowValue}
                >
                  {item.value}
                </ThemedText>
              ) : null}
              {item.description ? (
                <ThemedText variant="caption" color="textMuted">
                  {item.description}
                </ThemedText>
              ) : null}
            </ThemedCard>
          );
        })}
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
    gap: theme.spacing.md,
  },
  card: {
    padding: 0,
    overflow: 'hidden' as const,
  },
  row: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: 'transparent',
    gap: theme.spacing.xs,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontWeight: '600' as const,
  },
  rowValue: {
    fontWeight: '500' as const,
  },
});
