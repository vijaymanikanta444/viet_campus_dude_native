import { ReactNode } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { ThemedView } from '../../components/ThemedView';

type SafeAreaScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  includeTopInset?: boolean;
  includeBottomInset?: boolean;
  topOffset?: number;
  bottomOffset?: number;
};

export function SafeAreaScreen({
  children,
  style,
  contentStyle,
  scrollable = false,
  includeTopInset = true,
  includeBottomInset = true,
  topOffset = 0,
  bottomOffset,
}: SafeAreaScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const resolvedBottomOffset = bottomOffset ?? theme.spacing.lg;
  const paddingTop = (includeTopInset ? insets.top : 0) + topOffset;
  const paddingBottom =
    (includeBottomInset ? insets.bottom : 0) + resolvedBottomOffset;

  if (scrollable) {
    return (
      <View
        style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
      >
        {includeTopInset && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: insets.top + topOffset,
              backgroundColor: theme.colors.background,
              zIndex: 10,
            }}
          />
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          scrollIndicatorInsets={{
            top: insets.top,
            bottom: insets.bottom,
          }}
          contentContainerStyle={[
            {
              paddingTop,
              paddingBottom,
            },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <ThemedView
      style={[
        {
          flex: 1,
          paddingTop,
          paddingBottom,
        },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}
