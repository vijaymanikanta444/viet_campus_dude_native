import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'CAMPUS_DUDE_QUERY_CACHE',
  throttleTime: 1000,
});

export const setupOnlineManager = () => {
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(Boolean(state.isConnected));
    });
  });
};
