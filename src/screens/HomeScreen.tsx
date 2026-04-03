import { View } from 'react-native';

import { ThemedButton, ThemedCard, ThemedText } from '../components';
import { SafeAreaScreen } from '../layout';
import { useAuth } from '../context/AuthContext';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

export function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const { userEmail, logout } = useAuth();

  return (
    <SafeAreaScreen style={styles.container} contentStyle={styles.content}>
      <View style={styles.header}>
        <ThemedText variant="title">Home</ThemedText>
        <ThemedText variant="body" color="textMuted">
          You are signed in and ready to use the app.
        </ThemedText>
      </View>

      <ThemedCard>
        <View style={styles.cardContent}>
          <ThemedText variant="body" style={styles.label}>
            Logged in as
          </ThemedText>
          <ThemedText variant="body">{userEmail ?? 'VIET user'}</ThemedText>
          <ThemedText variant="caption" color="textMuted">
            This is a placeholder home screen for the authenticated flow.
          </ThemedText>
        </View>
      </ThemedCard>

      <ThemedButton
        label="Logout"
        onPress={() => void logout()}
        variant="danger"
        size="lg"
      />
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
  header: {
    gap: theme.spacing.xs,
  },
  cardContent: {
    gap: theme.spacing.sm,
  },
  label: {
    fontWeight: '700' as const,
  },
});
