import { ThemedCard, ThemedText } from '../components';
import { SafeAreaScreen } from '../layout';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

const POLICY_ITEMS = [
  {
    label: 'Data Collected',
    description:
      'We store profile, academic, and app usage details needed for student services.',
  },
  {
    label: 'Data Usage',
    description:
      'Data is used to show attendance, results, notifications, and personalized campus information.',
  },
  {
    label: 'Data Sharing',
    description:
      'Student data is shared only with authorized institutional systems and never sold to third parties.',
  },
  {
    label: 'Security',
    description:
      'We apply secure transport and authenticated access controls to protect account data.',
  },
] as const;

export function PrivacyPolicyScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaScreen style={styles.container} includeTopInset={false}>
      <ThemedText variant="body" color="textMuted">
        How Campus Dude collects, uses, and protects your data.
      </ThemedText>

      <ThemedCard style={styles.card}>
        {POLICY_ITEMS.map((item, index) => {
          const isLast = index === POLICY_ITEMS.length - 1;

          return (
            <ThemedCard
              key={item.label}
              style={[styles.row, isLast && styles.lastRow]}
            >
              <ThemedText variant="body" style={styles.rowLabel}>
                {item.label}
              </ThemedText>
              <ThemedText variant="caption" color="textMuted">
                {item.description}
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
});
