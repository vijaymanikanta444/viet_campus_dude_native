import { View } from 'react-native';
import { ThemedCard, ThemedText } from '../components';
import { SafeAreaScreen } from '../layout';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

const SUPPORT_ITEMS = [
  {
    label: 'Support Email',
    value: 'vijaymanikanta@viet.edu.in',
  },
  {
    label: 'Phone Support',
    value: '8985128873',
  },
  {
    label: 'Support Hours',
    value: 'Mon-Sat, 9:00 AM - 4:00 PM',
  },
  {
    label: 'Campus Help Desk',
    value: 'Admin Block, Ground Floor',
  },
] as const;

export function HelpSupportScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaScreen style={styles.container} includeTopInset={false}>
      <ThemedText variant="body" color="textMuted">
        Reach out for technical issues, account access, or campus app guidance.
      </ThemedText>

      <ThemedCard style={styles.card}>
        {SUPPORT_ITEMS.map((item, index) => {
          const isLast = index === SUPPORT_ITEMS.length - 1;

          return (
            <ThemedCard
              key={item.label}
              style={[styles.row, isLast && styles.lastRow]}
            >
              <ThemedText variant="body" style={styles.rowLabel}>
                {item.label}
              </ThemedText>
              <ThemedText
                variant="body"
                color="textMuted"
                style={styles.rowValue}
              >
                {item.value}
              </ThemedText>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
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
