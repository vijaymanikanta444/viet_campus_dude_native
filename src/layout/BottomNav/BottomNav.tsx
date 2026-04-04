import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../../components/Icon/Icon';
import { HomeScreen } from '../../screens/HomeScreen';
import { EventsScreen } from '../../screens/EventsScreen';
import { AppsScreen } from '../../screens/AppsScreen';
import { useTheme } from '../../theme';
import { MainTabParamList } from '../../navigation/types';
import { ProfileStackNavigator } from '../../navigation/ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabConfig = {
  icon: 'home' | 'calendar' | 'profile' | 'dashboard';
  label: string;
};

const tabConfigs: Record<string, TabConfig> = {
  HomeTab: { icon: 'home', label: 'Home' },
  EventsTab: { icon: 'calendar', label: 'Events' },
  ProfileTab: { icon: 'profile', label: 'Profile' },
  AppsTab: { icon: 'dashboard', label: 'Apps' },
};

export function BottomNav() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding =
    Platform.OS === 'android' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + tabBarBottomPadding;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = tabConfigs[route.name as keyof typeof tabConfigs];

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: StyleSheet.create({
            default: {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              borderTopWidth: 1,
              paddingBottom: tabBarBottomPadding,
              paddingTop: 8,
              height: tabBarHeight,
            },
          }).default,
          tabBarLabelStyle: {
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: 11,
            marginTop: 6,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={config.icon}
              size={size}
              color={color}
              active={focused}
            />
          ),
          tabBarLabel: config.label,
        };
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="EventsTab"
        component={EventsScreen}
        options={{
          tabBarLabel: 'Events',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="AppsTab"
        component={AppsScreen}
        options={{
          tabBarLabel: 'Apps',
        }}
      />
    </Tab.Navigator>
  );
}
