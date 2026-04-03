import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from './src/theme/index';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation';
import { queryClient } from './src/api/queryClient';
import { queryPersister, setupOnlineManager } from './src/api/offline';

setupOnlineManager();

function App() {
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
