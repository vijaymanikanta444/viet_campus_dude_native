import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '../screens/ProfileScreen';
import { ProfileSectionScreen } from '../screens/ProfileSectionScreen';
import type { ProfileStackParamList } from './types';
import { useTheme } from '../theme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold,
        },
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSection"
        component={ProfileSectionScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
}
