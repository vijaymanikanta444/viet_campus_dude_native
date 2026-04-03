import { useTheme, useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';
import {
  Icon,
  ThemedCard,
  ThemedText,
  ThemedView,
} from '../components';
import { SafeAreaScreen } from '../layout';

export function HomeScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaScreen
      scrollable
      style={styles.container}
      contentStyle={styles.content}
      topOffset={theme.spacing.md}
    >
      <ThemedView style={styles.header}>
        <ThemedText variant="title">Project Home</ThemedText>
        <ThemedText variant="body" color="textMuted">
          Keep this screen as your in-app quick guide.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionList}>
        <ThemedCard variant="outlined">
          <ThemedText variant="body" style={styles.sectionTitle}>
            What Is Included
          </ThemedText>
          <ThemedText variant="body">
            - Theming system (light and dark)
          </ThemedText>
          <ThemedText variant="body">- Reusable UI components</ThemedText>
          <ThemedText variant="body">
            - Navigation setup (bottom tabs + stack routing)
          </ThemedText>
          <ThemedText variant="body">
            - Axios setup with interceptors
          </ThemedText>
          <ThemedText variant="body">
            - Example screens and typed routes
          </ThemedText>
        </ThemedCard>

        <ThemedCard variant="default">
          <ThemedText variant="body" style={styles.sectionTitle}>
            Where To Change And See Reflection
          </ThemedText>
          <ThemedText variant="body">
            - src/screens/HomeScreen.tsx (this page)
          </ThemedText>
          <ThemedText variant="body">
            - src/navigation/AppRouter.tsx (routes and headers)
          </ThemedText>
          <ThemedText variant="body">
            - src/theme/theme.ts (colors, spacing, typography)
          </ThemedText>
          <ThemedText variant="body">
            - src/components/ (reusable UI components)
          </ThemedText>
          <ThemedText variant="body">
            - src/api/axiosInstance.ts (base URL, headers, interceptors)
          </ThemedText>
        </ThemedCard>

        <ThemedCard variant="default">
          <ThemedText variant="body" style={styles.sectionTitle}>
            Components Already Built
          </ThemedText>
          <ThemedText variant="body">- ThemedButton</ThemedText>
          <ThemedText variant="body">- ThemedInput</ThemedText>
          <ThemedText variant="body">- ThemedCard</ThemedText>
          <ThemedText variant="body">- ThemedLoader</ThemedText>
          <ThemedText variant="body">- ThemedText</ThemedText>
          <ThemedText variant="body">- ThemedView</ThemedText>
        </ThemedCard>

        <ThemedCard variant="default">
          <ThemedText variant="body" style={styles.sectionTitle}>
            SVG Icon System Example
          </ThemedText>
          <ThemedView style={styles.iconRow}>
            <Icon name="home" size={28} color="blue" />
            <Icon name="profile" size={28} />
            <Icon
              name="dashboard"
              variant="filled"
              size={28}
              color={theme.colors.primary}
            />
          </ThemedView>
          <ThemedText variant="caption" color="textMuted">
            Example: {'<Icon name="home" size={28} color="blue" />'}
          </ThemedText>
        </ThemedCard>

        <ThemedCard variant="default">
          <ThemedText variant="body" style={styles.sectionTitle}>
            Icon Generation (Android and iOS)
          </ThemedText>
          <ThemedText variant="body">
            1. Put source icon at src/assets/icon.png
          </ThemedText>
          <ThemedText variant="body">
            2. Run: npx rn-app-icons src/assets/icon.png
          </ThemedText>
          <ThemedText variant="body">
            3. Rebuild app: npm run android / npm run ios
          </ThemedText>
        </ThemedCard>

        <ThemedCard variant="elevated">
          <ThemedText variant="body" style={styles.sectionTitle}>
            Notes
          </ThemedText>
          <ThemedText variant="body">
            Navigation setup is ready using bottom tabs with stack routing.
          </ThemedText>
          <ThemedText variant="body">
            Axios setup is ready with centralized request and response
            interceptors.
          </ThemedText>
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
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  sectionList: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontWeight: '700' as const,
    marginBottom: theme.spacing.sm,
  },
  iconRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
});
