import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon, ThemedButton, ThemedCard, ThemedText } from '../components';
import { useAuth } from '../context/AuthContext';
import { SafeAreaScreen } from '../layout';
import type { ProfileStackParamList } from '../navigation/types';
import { getDisplayName } from '../services/api';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

type SectionRowProps = {
  label: string;
  value?: string;
  isLast?: boolean;
};

function SectionRow({ label, value, isLast = false }: SectionRowProps) {
  return (
    <Pressable
      onPress={() => console.log(`Pressed: ${label}`)}
      style={[stylesStatic.row, !isLast && stylesStatic.rowBorder]}
    >
      <ThemedText variant="body" style={stylesStatic.rowLabel}>
        {label}
      </ThemedText>
      <View style={stylesStatic.rowRight}>
        {value ? (
          <ThemedText
            variant="body"
            color="textMuted"
            style={stylesStatic.rowValue}
          >
            {value}
          </ThemedText>
        ) : null}
        <Icon name="chevron-right" size={20} />
      </View>
    </Pressable>
  );
}

export function ProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const { userEmail, userProfile, logout } = useAuth();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>
    >();

  const displayName = useMemo(
    () => getDisplayName(userProfile, userEmail),
    [userEmail, userProfile],
  );

  const initials = useMemo(() => {
    const source = displayName.trim();

    if (!source) {
      return 'S';
    }

    const parts = source.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
  }, [displayName]);

  const subtitle = `${userProfile?.branch ?? 'CSE'} | ${
    userProfile?.year ?? 3
  } Year | Visakhapatnam`;
  const dateTimeLabel = useMemo(
    () =>
      new Date().toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    [],
  );

  return (
    <SafeAreaScreen style={styles.container} scrollable>
      <View style={styles.content}>
        <ThemedText variant="title" style={styles.pageTitle}>
          Profile
        </ThemedText>

        <ThemedCard style={styles.idCard}>
          <View style={styles.idCardTopRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <ThemedText variant="title" style={styles.avatarText}>
                  {initials}
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate('ProfileSection', {
                  title: 'Full Profile',
                  subtitle: 'Complete student information and account details.',
                  items: [
                    {
                      label: 'Full Name',
                      value: displayName,
                    },
                    {
                      label: 'Student ID',
                      value: userProfile?.userId ?? 'VIET-STUDENT',
                    },
                    {
                      label: 'Department',
                      value: userProfile?.branch ?? 'CSE',
                    },
                    {
                      label: 'Year',
                      value: `${userProfile?.year ?? 3} Year`,
                    },
                    {
                      label: 'Email',
                      value: userEmail ?? userProfile?.email ?? 'Not available',
                    },
                  ],
                })
              }
            >
              <View style={stylesStatic.viewProfileRow}>
                <ThemedText variant="body" style={styles.viewProfileText}>
                  View Full Profile
                </ThemedText>
                <Icon name="chevron-right" size={18} />
              </View>
            </Pressable>
          </View>

          <View style={styles.idCardBody}>
            <ThemedText variant="title" style={styles.studentName}>
              {displayName} ({userProfile?.userId ?? 'VIET-STUDENT'})
            </ThemedText>
            <ThemedText
              variant="body"
              color="textMuted"
              style={styles.studentMeta}
            >
              {subtitle}
            </ThemedText>
            <ThemedText
              variant="body"
              color="textMuted"
              style={styles.metaLine}
            >
              Time {dateTimeLabel}
            </ThemedText>
            <ThemedText
              variant="body"
              color="textMuted"
              style={styles.metaLine}
            >
              Email {userEmail ?? userProfile?.email ?? 'Not available'}
            </ThemedText>
          </View>
        </ThemedCard>

        <View style={styles.sectionWrap}>
          <ThemedText variant="title" style={styles.groupTitle}>
            General Settings
          </ThemedText>
          <ThemedCard style={styles.sectionCard}>
            <SectionRow label="Face ID" value="On" />
            <SectionRow label="Location Permissions" />
            <SectionRow label="Notifications" value="On" isLast />
          </ThemedCard>
        </View>

        <View style={styles.sectionWrap}>
          <ThemedText variant="title" style={styles.groupTitle}>
            Academic
          </ThemedText>
          <ThemedCard style={styles.sectionCard}>
            <SectionRow label="Attendance" value="82%" />
            <SectionRow label="Results" value="Latest Published" />
            <SectionRow label="Class Timetable" isLast />
          </ThemedCard>
        </View>

        <View style={styles.sectionWrap}>
          <ThemedText variant="title" style={styles.groupTitle}>
            About The App
          </ThemedText>
          <ThemedCard style={styles.sectionCard}>
            <SectionRow label="Version" value="0.0.3" />
            <SectionRow label="Privacy Policy" />
            <SectionRow label="Help & Support" isLast />
          </ThemedCard>
        </View>

        <View style={styles.signOutContainer}>
          <ThemedButton
            label="Sign Out"
            onPress={() => void logout()}
            variant="danger"
            size="lg"
          />
        </View>
      </View>
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
  pageTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  idCard: {
    minHeight: 280,
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  idCardTopRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  avatarWrap: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarText: {
    color: theme.colors.textPrimary,
  },
  viewProfileText: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  idCardBody: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  studentName: {
    fontWeight: '700' as const,
  },
  studentMeta: {
    marginBottom: theme.spacing.xs,
  },
  metaLine: {
    lineHeight: 22,
  },
  sectionWrap: {
    marginTop: theme.spacing.md,
  },
  groupTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    marginBottom: theme.spacing.sm,
  },
  sectionCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: 'hidden' as const,
  },
  signOutContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});

const stylesStatic = StyleSheet.create({
  row: {
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D7DEEA',
  },
  rowLabel: {
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontWeight: '500',
  },
  viewProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
