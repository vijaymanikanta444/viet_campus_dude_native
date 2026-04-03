import { Theme } from '../theme/theme';
import { useThemedStyles } from '../theme';
import { ThemedCard, ThemedText, ThemedView } from '../components';
import { SafeAreaScreen } from '../layout';

export function ProfileScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaScreen style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText variant="title">Profile</ThemedText>
        <ThemedText variant="body" color="textMuted">
          Manage your personal details, preferences, and account settings.
        </ThemedText>

        <ThemedCard>
          <ThemedText variant="body" style={styles.cardTitle}>
            Quick Summary
          </ThemedText>
          <ThemedText variant="body">- Name: Student Name</ThemedText>
          <ThemedText variant="body">- Department: CSE</ThemedText>
          <ThemedText variant="body">- Year: 3rd Year</ThemedText>
        </ThemedCard>
      </ThemedView>
    </SafeAreaScreen>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cardTitle: {
    fontWeight: '700' as const,
    marginBottom: theme.spacing.sm,
  },
});
