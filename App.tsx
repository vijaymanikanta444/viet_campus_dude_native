import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/layout';
import { AppRouter } from './src/navigation';
import { ThemeProvider } from './src/theme/index';
import appConfig from './app.json';

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1200);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        {isSplashVisible ? (
          <SplashScreen appName={appConfig.displayName ?? appConfig.name} />
        ) : (
          <AppRouter />
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
