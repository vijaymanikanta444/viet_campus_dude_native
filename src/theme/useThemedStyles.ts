import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import { Theme } from './theme';

type NamedStyles<T> = { [P in keyof T]: object };

export function useThemedStyles<T extends NamedStyles<T>>(
  createStyles: (theme: Theme) => T,
) {
  const { theme } = useTheme();

  return useMemo(
    () => StyleSheet.create(createStyles(theme)),
    [createStyles, theme],
  );
}
