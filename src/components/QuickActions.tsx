import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { useTheme } from '../theme';

export type QuickAction = {
  key: string;
  label: string;
  iconText: string;
};

type QuickActionsProps = {
  actions: QuickAction[];
  onPressAction: (action: QuickAction) => void;
};

function QuickActionsBase({ actions, onPressAction }: QuickActionsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.grid}>
      {actions.map(action => (
        <Pressable
          key={action.key}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => onPressAction(action)}
        >
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: theme.colors.surfaceAlt },
            ]}
          >
            <ThemedText style={styles.iconText}>{action.iconText}</ThemedText>
          </View>

          <ThemedText variant="caption" style={styles.label}>
            {action.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 16,
    lineHeight: 20,
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export const QuickActions = memo(QuickActionsBase);