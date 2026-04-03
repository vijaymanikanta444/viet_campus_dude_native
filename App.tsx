import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/index';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation';

function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
