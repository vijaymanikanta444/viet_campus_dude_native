import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../layout';
import { LoginScreen } from '../screens/LoginScreen';
import { PlaceholderDetailsScreen } from '../screens/PlaceholderDetailsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { useTheme } from '../theme';

type AuthStackParamList = {
  Login: undefined;
};

type AppStackParamList = {
  Home: undefined;
  PlaceholderDetails: {
    title: string;
    subtitle?: string;
  };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Home"
        component={BottomNav}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="PlaceholderDetails"
        component={PlaceholderDetailsScreen}
        options={{ title: 'Details' }}
      />
    </AppStack.Navigator>
  );
}

export function AppNavigator() {
  const { theme } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();
  const baseTheme =
    theme.mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        ...baseTheme,
        dark: theme.mode === 'dark',
        colors: {
          ...baseTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          notification: theme.colors.danger,
        },
      }}
    >
      <View style={styles.container}>
        {isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
