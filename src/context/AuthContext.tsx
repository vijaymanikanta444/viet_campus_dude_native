import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  loginWithCredentials,
  loginWithSSO,
  type AuthSession,
} from '../services/authService';

const AUTH_STORAGE_KEY = '@campus-dude/auth-session';
const MIN_SPLASH_DURATION_MS = 2000;

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithSSO: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseStoredSession(rawValue: string | null): AuthSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as AuthSession;
    if (!parsed?.isAuthenticated) {
      return null;
    }

    return parsed;
  } catch {
    // Support older boolean-only values if present.
    if (rawValue === 'true') {
      return {
        token: 'legacy-session',
        email: null,
        isAuthenticated: true,
      };
    }

    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const startedAt = Date.now();

    const bootstrapAuth = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        const session = parseStoredSession(storedValue);

        if (!isMounted) {
          return;
        }

        setIsAuthenticated(Boolean(session));
        setUserEmail(session?.email ?? null);

        const elapsed = Date.now() - startedAt;
        const remainingDelay = Math.max(0, MIN_SPLASH_DURATION_MS - elapsed);

        if (remainingDelay > 0) {
          await new Promise<void>(resolve =>
            setTimeout(resolve, remainingDelay),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginWithCredentials(email, password);

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
    setUserEmail(session.email);
  }, []);

  const handleSSOLogin = useCallback(async () => {
    const session = await loginWithSSO();

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
    setUserEmail(session.email);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        userEmail,
        login,
        loginWithSSO: handleSSOLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
