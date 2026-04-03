import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { useTheme } from '../theme';

type AlertCardProps = {
  message: string;
};

function AlertCardBase({ message }: AlertCardProps) {
  const { theme } = useTheme();

  return (
    <ThemedCard
      style={[
        styles.card,
        {
          borderColor: theme.colors.danger,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.row}>
        <ThemedText style={styles.icon}>⚠️</ThemedText>
        <ThemedText variant="caption" style={styles.message}>
          {message}
        </ThemedText>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
    lineHeight: 20,
  },
  message: {
    flex: 1,
  },
});

export const AlertCard = memo(AlertCardBase);