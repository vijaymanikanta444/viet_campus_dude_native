import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText, ThemedView } from '../../components';
import { useTheme } from '../../theme';
import { launchApp, getAvailableApps, AppItem } from '../../utils/appLauncher';

export function AppsBottomSheet({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const apps = getAvailableApps();

  const handleAppPress = useCallback(
    async (app: AppItem) => {
      const runLaunch = async () => {
        try {
          await launchApp(app);
          // Only close sheet if app was successfully launched
          onClose();
        } catch (error) {
          if (error instanceof Error && error.message === 'USER_CANCELLED') {
            return;
          }

          const errorMessage =
            error instanceof Error ? error.message : 'Failed to open app';
          Alert.alert('Unable to Open App', errorMessage);
          // Keep sheet open on error
        }
      };

      if (Platform.OS === 'ios' && app.iosUrl) {
        Alert.alert('Open App', `Do you want to open ${app.name}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => void runLaunch() },
        ]);
        return;
      }

      await runLaunch();
    },
    [onClose],
  );

  const renderAppItem = useCallback(
    ({ item }: { item: AppItem }) => (
      <TouchableOpacity
        style={[
          styles.appItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => handleAppPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.appIcon,
            { backgroundColor: theme.colors.primary + '20' },
          ]}
        >
          <ThemedText variant="title" style={{ fontSize: 24 }}>
            {item.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText
          variant="body"
          style={[styles.appName, { maxWidth: '95%' }]}
        >
          {item.name}
        </ThemedText>
      </TouchableOpacity>
    ),
    [theme, handleAppPress],
  );

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <ThemedView
        style={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            Browse Apps
          </ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <ThemedText style={{ fontSize: 24, fontWeight: '600' }}>
              ×
            </ThemedText>
          </Pressable>
        </View>

        <FlatList
          data={apps}
          renderItem={renderAppItem}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          scrollEnabled
          nestedScrollEnabled
        />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  appItem: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flex: 0.3,
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    textAlign: 'center',
    fontSize: 12,
  },
});
