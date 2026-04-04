import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
  type AppStateStatus,
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../layout';
import { LoginScreen } from '../screens/LoginScreen';
import { PlaceholderDetailsScreen } from '../screens/PlaceholderDetailsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { useTheme } from '../theme';

const BIOMETRIC_UNLOCK_KEY = 'biometric_unlock_enabled';

type AuthStackParamList = {
  Login: undefined;
};

type AppStackParamList = {
  MainTabs: undefined;
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
        name="MainTabs"
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
  const [isLocked, setIsLocked] = useState(false);
  const [isCheckingLock, setIsCheckingLock] = useState(true);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isAuthenticatingRef = useRef(false);
  const baseTheme =
    theme.mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  const overlayStyles = useMemo(
    () => ({
      background: theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.72)' : 'rgba(0, 0, 0, 0.45)',
      cardBg: theme.colors.surface,
      title: theme.colors.textPrimary,
      subtitle: theme.colors.textMuted,
      buttonBg: theme.colors.primary,
      buttonText: '#FFFFFF',
    }),
    [theme],
  );

  const authenticateAndUnlock = useCallback(async () => {
    if (isAuthenticatingRef.current) {
      return;
    }

    isAuthenticatingRef.current = true;

    try {
      const biometrics = new ReactNativeBiometrics();
      const { available } = await biometrics.isSensorAvailable();

      if (!available) {
        // Avoid deadlock if biometric is not available anymore.
        setIsLocked(false);
        return;
      }

      const result = await biometrics.simplePrompt({
        promptMessage: 'Unlock Campus Dude',
        fallbackPromptMessage: 'Use passcode',
      });

      if (result.success) {
        setIsLocked(false);
      }
    } catch {
      // Keep lock screen visible if auth fails/cancels.
      setIsLocked(true);
    } finally {
      isAuthenticatingRef.current = false;
    }
  }, []);

  const checkAndLockIfNeeded = useCallback(async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_UNLOCK_KEY);
      const shouldLock = enabled === 'true' && isAuthenticated;
      setIsLocked(shouldLock);

      if (shouldLock) {
        await authenticateAndUnlock();
      }
    } finally {
      setIsCheckingLock(false);
    }
  }, [authenticateAndUnlock, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLocked(false);
      setIsCheckingLock(false);
      return;
    }

    setIsCheckingLock(true);
    void checkAndLockIfNeeded();
  }, [checkAndLockIfNeeded, isAuthenticated]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasInBackground = appStateRef.current === 'background';

      if (wasInBackground && nextState === 'active' && isAuthenticated) {
        void checkAndLockIfNeeded();
      }

      appStateRef.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkAndLockIfNeeded, isAuthenticated]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isCheckingLock && isAuthenticated) {
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

        {isAuthenticated && isLocked ? (
          <View style={[styles.lockOverlay, { backgroundColor: overlayStyles.background }]}>
            <View style={[styles.lockCard, { backgroundColor: overlayStyles.cardBg }]}>
              <Text style={[styles.lockTitle, { color: overlayStyles.title }]}>App Locked</Text>
              <Text style={[styles.lockSubtitle, { color: overlayStyles.subtitle }]}>
                Use Face ID, Touch ID, or device biometrics to continue.
              </Text>
              <Pressable
                onPress={() => {
                  void authenticateAndUnlock();
                }}
                style={[styles.unlockButton, { backgroundColor: overlayStyles.buttonBg }]}
              >
                <Text style={[styles.unlockButtonText, { color: overlayStyles.buttonText }]}>Unlock</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  lockCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  lockSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  unlockButton: {
    minWidth: 150,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
