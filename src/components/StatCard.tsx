import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';

type StatCardProps = {
  label: string;
  value: string;
};

function StatCardBase({ label, value }: StatCardProps) {
  return (
    <ThemedCard variant="elevated" style={styles.card}>
      <View style={styles.content}>
        <ThemedText variant="caption" color="textMuted">
          {label}
        </ThemedText>
        <ThemedText variant="title" style={styles.value}>
          {value}
        </ThemedText>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 10,
  },
  content: {
    gap: 6,
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
  },
});

export const StatCard = memo(StatCardBase);