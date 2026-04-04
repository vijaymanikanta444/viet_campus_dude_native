import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from './src/theme/index';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation';
import { queryClient } from './src/api/queryClient';
import { queryPersister, setupOnlineManager } from './src/api/offline';
import { pushNotificationsModule } from './src/modules/notifications';

setupOnlineManager();

function App() {
  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | undefined;

    const bootstrapNotifications = async () => {
      try {
        await pushNotificationsModule.initialize();

        const permissionStatus =
          await pushNotificationsModule.requestPermission();
        if (permissionStatus === 'denied' || permissionStatus === 'blocked') {
          return;
        }

        const token = await pushNotificationsModule.getDeviceToken();
        if (token) {
          console.log('FCM token:', token);
          // TODO: send token to backend once the token registration endpoint is available.
        }

        unsubscribeTokenRefresh = pushNotificationsModule.onTokenRefresh(
          nextToken => {
            console.log('FCM token refreshed:', nextToken);
            // TODO: update backend token record on refresh.
          },
        );
      } catch (error) {
        console.log('Failed to bootstrap push notifications:', error);
      }
    };

    void bootstrapNotifications();

    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: queryPersister,
            maxAge: 1000 * 60 * 60 * 24,
          }}
        >
          <AuthProvider>
            <View style={styles.container}>
              <AppNavigator />
            </View>
          </AuthProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
