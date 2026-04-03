import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ThemeColors, useTheme } from '../theme';

type ThemedViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: keyof ThemeColors;
};

export function ThemedView({
  children,
  style,
  backgroundColor = 'background',
}: ThemedViewProps) {
  const { theme } = useTheme();

  return (
    <View style={[{ backgroundColor: theme.colors[backgroundColor] }, style]}>
      {children}
    </View>
  );
}
