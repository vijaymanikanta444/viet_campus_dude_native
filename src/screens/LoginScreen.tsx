import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import {
  ThemedButton,
  ThemedCard,
  ThemedInput,
  ThemedText,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';
import { validateLoginForm } from '../utils/validation';

export function LoginScreen() {
  const styles = useThemedStyles(createStyles);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <ThemedText variant="title" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText variant="body" color="textMuted" style={styles.subtitle}>
          Sign in with your VIET email to continue.
        </ThemedText>

        <ThemedCard>
          <View style={styles.form}>
            <View>
              <ThemedText variant="body" style={styles.label}>
                Email
              </ThemedText>
              <ThemedInput
                placeholder="your.name@viet.edu.in"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={Boolean(errors.email)}
              />
              {errors.email ? (
                <ThemedText
                  variant="caption"
                  color="danger"
                  style={styles.error}
                >
                  {errors.email}
                </ThemedText>
              ) : null}
            </View>

            <View>
              <ThemedText variant="body" style={styles.label}>
                Password
              </ThemedText>
              <ThemedInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={Boolean(errors.password)}
              />
              {errors.password ? (
                <ThemedText
                  variant="caption"
                  color="danger"
                  style={styles.error}
                >
                  {errors.password}
                </ThemedText>
              ) : null}
            </View>

            <ThemedButton
              label="Login"
              onPress={() => void handleLogin()}
              loading={isSubmitting}
              size="lg"
            />
          </View>
        </ThemedCard>

        <ThemedText variant="caption" color="textMuted" style={styles.helper}>
          SSO is reserved for future SAML/OAuth integration.
        </ThemedText>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.lg,
    justifyContent: 'center' as const,
  },
  title: {
    textAlign: 'center' as const,
  },
  subtitle: {
    textAlign: 'center' as const,
  },
  form: {
    gap: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    fontWeight: '600' as const,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
  helper: {
    textAlign: 'center' as const,
  },
});
