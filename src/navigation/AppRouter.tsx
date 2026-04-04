import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
  type LinkingOptions,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNav, Header } from '../layout';
import { useTheme } from '../theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function normalizeDeepLinkUrl(url: string): string {
  const match = url.match(
    /^campusdude:\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/,
  );

  if (!match) {
    return url;
  }

  const [, host, path = '', query = '', hash = ''] = match;

  // Accept host-style deep links (campusdude://profile) by converting them
  // into path-style deep links (campusdude:///profile) for consistent parsing.
  return `campusdude:///${host}${path}${query}${hash}`;
}

function parseTabRoute(normalized: string): string | null {
  // Extract the tab name from normalized URL
  // campusdude:///profile -> profile
  const match = normalized.match(/campusdude:\/\/\/([a-z]+)/);
  if (!match) return null;

  const tab = match[1];
  const tabMap: { [key: string]: string } = {
    home: 'HomeTab',
    events: 'EventsTab',
    profile: 'ProfileTab',
    apps: 'AppsTab',
  };

  return tabMap[tab] || null;
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['campusdude://'],
  config: {
    screens: {
      Home: {
        screens: {
          HomeTab: 'home',
          EventsTab: 'events',
          ProfileTab: 'profile',
          AppsTab: 'apps',
        },
      },
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (!url) return null;
    const normalized = normalizeDeepLinkUrl(url);
    console.log('[Deep Link] Initial URL:', url, '-> Normalized:', normalized);
    return normalized;
  },
  subscribe(listener) {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const normalized = normalizeDeepLinkUrl(url);
      console.log(
        '[Deep Link] URL received:',
        url,
        '-> Normalized:',
        normalized,
      );
      listener(normalized);
    });

    return () => subscription.remove();
  },
};

export function AppRouter() {
  const { theme } = useTheme();
  const baseTheme =
    theme.mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // Handle deep links for warm-start (app already in memory)
  useEffect(() => {
    console.log('[Deep Link] Warm-start listener attached');

    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('[Deep Link] Warm-start handler received:', url);
      const normalized = normalizeDeepLinkUrl(url);
      console.log('[Deep Link] Normalized:', normalized);

      const tab = parseTabRoute(normalized);
      console.log('[Deep Link] Parsed tab:', tab);
      console.log('[Deep Link] Navigator ready:', navigationRef.isReady());

      if (tab && navigationRef.isReady()) {
        console.log('[Deep Link] Navigating to tab:', tab);
        navigationRef.navigate('Home', {
          screen: tab as any,
        });
      } else {
        console.log(
          '[Deep Link] Could not navigate - tab:',
          tab,
          'ready:',
          navigationRef.isReady(),
        );
      }
    });

    return () => {
      console.log('[Deep Link] Warm-start listener cleanup');
      subscription.remove();
    };
  }, [navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
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
      <Stack.Navigator
        screenOptions={{
          header: props => <Header {...props} />,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={BottomNav}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
