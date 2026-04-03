import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';

type AppHeaderProps = NativeStackHeaderProps & {
  subtitle?: string;
  showBackButton?: boolean;
};

function resolveTitle({
  options,
  route,
}: Pick<NativeStackHeaderProps, 'options' | 'route'>): string {
  if (typeof options.headerTitle === 'string') {
    return options.headerTitle;
  }

  if (typeof options.title === 'string') {
    return options.title;
  }

  return route.name;
}

export function Header({
  navigation,
  back,
  options,
  route,
  subtitle,
  showBackButton,
}: AppHeaderProps) {
  const { theme } = useTheme();
  const title = resolveTitle({ options, route });
  const canGoBack = showBackButton ?? Boolean(back);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.sideSlot}>
        {canGoBack ? (
          <Pressable onPress={navigation.goBack} hitSlop={8}>
            <Text
              style={[
                styles.backLabel,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily.medium,
                },
              ]}
            >
              Back
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.centerSlot}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                color: theme.colors.textMuted,
                fontFamily: theme.typography.fontFamily.regular,
              },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sideSlot: {
    width: 72,
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '400',
    includeFontPadding: false,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '500',
    includeFontPadding: false,
  },
});
