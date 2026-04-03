import { Theme } from '../theme/theme';
import { useThemedStyles } from '../theme';
import { ThemedCard, ThemedText, ThemedView } from '../components';
import { SafeAreaScreen } from '../layout';

export function EventsScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaScreen style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText variant="title">Upcoming Events</ThemedText>
        <ThemedText variant="body" color="textMuted">
          Discover the next campus activities and sessions.
        </ThemedText>

        <ThemedCard>
          <ThemedText variant="body" style={styles.cardTitle}>
            This Week
          </ThemedText>
          <ThemedText variant="body">- Coding Club Meetup</ThemedText>
          <ThemedText variant="body">- Career Guidance Seminar</ThemedText>
          <ThemedText variant="body">- Sports Day Practice</ThemedText>
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
