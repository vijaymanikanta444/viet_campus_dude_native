import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  AlertCard,
  Carousel,
  QuickActions,
  StatCard,
  ThemedCard,
  ThemedText,
} from '../components';
import { SafeAreaScreen } from '../layout';
import { useAuth } from '../context/AuthContext';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';
import {
  getDisplayName,
  getGreetingByTime,
  type AlertItem,
  type Banner,
  type EventItem,
} from '../services/api';
import {
  useAlertsQuery,
  useBannersQuery,
  useDashboardSummaryQuery,
  useEventsQuery,
  useTodaySummaryQuery,
} from '../api/queryHooks';

type QuickActionKey =
  | 'attendance'
  | 'assignments'
  | 'exams'
  | 'fees'
  | 'results'
  | 'library';

const QUICK_ACTIONS = [
  { key: 'attendance', label: 'Attendance', iconText: '🧾' },
  { key: 'assignments', label: 'Assignments', iconText: '📝' },
  { key: 'exams', label: 'Exams', iconText: '📘' },
  { key: 'fees', label: 'Fees', iconText: '💳' },
  { key: 'results', label: 'Results', iconText: '📊' },
  { key: 'library', label: 'Library', iconText: '📚' },
] as const;

export function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userEmail, userProfile } = useAuth();

  // TanStack Query hooks - automatically handles loading, caching, errors
  const bannersQuery = useBannersQuery();
  const summaryQuery = useDashboardSummaryQuery();
  const todayQuery = useTodaySummaryQuery();
  const alertsQuery = useAlertsQuery();
  const eventsQuery = useEventsQuery();

  console.log({ todayQuery });

  // Check if anything is loading
  const isRefreshing =
    bannersQuery.isLoading ||
    summaryQuery.isLoading ||
    todayQuery.isLoading ||
    alertsQuery.isLoading ||
    eventsQuery.isLoading;

  // Trigger fade animation when banners load
  useEffect(() => {
    if (bannersQuery.data && bannersQuery.data.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [bannersQuery.data, fadeAnim]);

  const greeting = useMemo(() => getGreetingByTime(), []);
  const displayName = useMemo(
    () => getDisplayName(userProfile, userEmail),
    [userEmail, userProfile],
  );

  // Refresh all queries at once
  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      bannersQuery.refetch(),
      summaryQuery.refetch(),
      todayQuery.refetch(),
      alertsQuery.refetch(),
      eventsQuery.refetch(),
    ]);
  }, [bannersQuery, summaryQuery, todayQuery, alertsQuery, eventsQuery]);

  const banners = bannersQuery.data ?? [];
  const summary = summaryQuery.data ?? null;
  const today = todayQuery.data ?? null;
  const alerts = (alertsQuery.data ?? []).slice(0, 2);
  const events = eventsQuery.data ?? [];

  const openPlaceholder = useCallback(
    (title: string, subtitle: string) => {
      navigation.getParent()?.navigate('PlaceholderDetails', {
        title,
        subtitle,
      });
    },
    [navigation],
  );

  const onBannerPress = useCallback(
    (banner: Banner) => {
      openPlaceholder(
        banner.type === 'EVENT' ? 'Event Details' : 'Announcement',
        `Open ${banner.type.toLowerCase()} details for ${banner.redirectId}.`,
      );
    },
    [openPlaceholder],
  );

  const onQuickActionPress = useCallback(
    (action: { key: string; label: string }) => {
      const routeByKey: Partial<Record<QuickActionKey, string>> = {
        attendance: 'ProfileTab',
        assignments: 'EventsTab',
        exams: 'EventsTab',
        fees: 'AppsTab',
        results: 'ProfileTab',
        library: 'AppsTab',
      };

      const nextTab = routeByKey[action.key as QuickActionKey];

      if (nextTab) {
        navigation.navigate(nextTab);
        return;
      }

      openPlaceholder(
        action.label,
        `${action.label} module will be available soon.`,
      );
    },
    [navigation, openPlaceholder],
  );

  const stats = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      {
        key: 'attendance',
        label: 'Attendance',
        value: `${summary.attendance}%`,
      },
      {
        key: 'pendingAssignments',
        label: 'Pending Assignments',
        value: `${summary.pendingAssignments}`,
      },
      { key: 'cgpa', label: 'CGPA', value: `${summary.cgpa}` },
      { key: 'feesDue', label: 'Fees Due', value: `INR ${summary.feesDue}` },
    ];
  }, [summary]);

  const renderStatCard = useCallback(
    ({ item }: { item: { key: string; label: string; value: string } }) => (
      <StatCard label={item.label} value={item.value} />
    ),
    [],
  );

  const renderEventCard = useCallback(
    ({ item }: { item: EventItem }) => (
      <Pressable
        style={[styles.eventCard, styles.shadowCard]}
        onPress={() =>
          openPlaceholder(item.title, `${item.dateLabel} at ${item.venue}`)
        }
      >
        <ThemedText variant="body" style={styles.eventTitle}>
          {item.title}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted">
          {item.dateLabel}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted">
          {item.venue}
        </ThemedText>
      </Pressable>
    ),
    [openPlaceholder, styles.eventCard, styles.eventTitle, styles.shadowCard],
  );

  return (
    <SafeAreaScreen
      style={styles.container}
      contentStyle={styles.content}
      scrollable
      includeTopInset
      refreshing={isRefreshing}
      onRefresh={() => {
        void refreshDashboard();
      }}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <ThemedText variant="body" color="textMuted">
            {greeting}
          </ThemedText>
          <ThemedText variant="title" style={styles.welcomeTitle}>
            {`Welcome, ${displayName} `}
            {'👋'}
          </ThemedText>
          <ThemedText variant="body" color="textMuted">
            Here's what's happening today
          </ThemedText>
        </View>
      </Animated.View>

      {banners.length > 0 ? (
        <View style={styles.section}>
          <Carousel data={banners} onPressItem={onBannerPress} />
        </View>
      ) : null}

      <View style={styles.section}>
        <ThemedText variant="body" style={styles.sectionTitle}>
          Quick Actions
        </ThemedText>
        <QuickActions
          actions={[...QUICK_ACTIONS]}
          onPressAction={onQuickActionPress}
        />
      </View>

      <ThemedCard style={styles.snapshotCard}>
        <View style={styles.snapshotRow}>
          <View>
            <ThemedText variant="caption" color="textMuted">
              Today Snapshot
            </ThemedText>
            <ThemedText variant="body" style={styles.snapshotPrimary}>
              {today?.classesToday ?? 0} Classes Today
            </ThemedText>
            <ThemedText variant="caption" color="textMuted">
              {today?.assignmentsDue ?? 0} Assignment Due
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      {stats.length > 0 ? (
        <View style={styles.section}>
          <ThemedText variant="body" style={styles.sectionTitle}>
            Academic Stats
          </ThemedText>
          <FlatList
            data={stats}
            horizontal
            keyExtractor={item => item.key}
            renderItem={renderStatCard}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {alerts.length > 0 ? (
        <View style={styles.section}>
          <ThemedText variant="body" style={styles.sectionTitle}>
            Important Alerts
          </ThemedText>
          {alerts.map(alertItem => (
            <AlertCard key={alertItem.id} message={alertItem.message} />
          ))}
        </View>
      ) : null}

      {events.length > 0 ? (
        <View style={styles.section}>
          <ThemedText variant="body" style={styles.sectionTitle}>
            Upcoming Events
          </ThemedText>
          <FlatList
            data={events}
            horizontal
            keyExtractor={item => item.id}
            renderItem={renderEventCard}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}
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
    paddingBottom: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  welcomeTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700' as const,
  },
  snapshotCard: {
    borderRadius: theme.radius.lg,
  },
  snapshotRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  snapshotPrimary: {
    fontWeight: '700' as const,
    marginTop: theme.spacing.xs,
  },
  shadowCard: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  eventCard: {
    width: 180,
    marginRight: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  eventTitle: {
    fontWeight: '700' as const,
  },
});
