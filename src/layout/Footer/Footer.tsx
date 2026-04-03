import type { ReactNode } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '../../components/ThemedView';
import { useTheme } from '../../theme';

type FooterProps = {
  children: ReactNode;
};

export function Footer({ children }: FooterProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={{
        width: '100%',
        alignItems: 'center',
        paddingBottom: insets.bottom + theme.spacing.md,
      }}
    >
      {children}
    </ThemedView>
  );
}
