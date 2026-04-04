import {
  type PushNotificationPayload,
  type PushNotificationsAdapter,
  type PushPermissionStatus,
} from './types';
import messaging, {
  AuthorizationStatus,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

function toPayload(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): PushNotificationPayload {
  return {
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    data: remoteMessage.data,
  };
}

function toPermissionStatus(status: number): PushPermissionStatus {
  if (status === AuthorizationStatus.AUTHORIZED) {
    return 'granted';
  }

  if (status === AuthorizationStatus.PROVISIONAL) {
    return 'provisional';
  }

  if (status === AuthorizationStatus.DENIED) {
    return 'denied';
  }

  return 'not-determined';
}

async function requestAndroidNotificationPermission(): Promise<PushPermissionStatus> {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return 'granted';
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return 'granted';
  }

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return 'blocked';
  }

  return 'denied';
}

class FirebasePushNotificationsAdapter implements PushNotificationsAdapter {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await messaging().registerDeviceForRemoteMessages();
    this.initialized = true;
  }

  async requestPermission(): Promise<PushPermissionStatus> {
    const androidStatus = await requestAndroidNotificationPermission();
    if (androidStatus === 'denied' || androidStatus === 'blocked') {
      return androidStatus;
    }

    const status = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
      provisional: true,
    });

    return toPermissionStatus(status);
  }

  async getDeviceToken(): Promise<string | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      return await messaging().getToken();
    } catch {
      return null;
    }
  }

  onTokenRefresh(listener: (token: string) => void): () => void {
    return messaging().onTokenRefresh(listener);
  }

  onForegroundMessage(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    return messaging().onMessage(remoteMessage => {
      listener(toPayload(remoteMessage));
    });
  }

  onNotificationOpened(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      listener(toPayload(remoteMessage));
    });

    void messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          listener(toPayload(remoteMessage));
        }
      });

    return unsubscribe;
  }
}

class NoopPushNotificationsAdapter implements PushNotificationsAdapter {
  async initialize(): Promise<void> {
    return;
  }

  async requestPermission(): Promise<PushPermissionStatus> {
    return 'not-determined';
  }

  async getDeviceToken(): Promise<string | null> {
    return null;
  }

  onTokenRefresh(_listener: (token: string) => void): () => void {
    return () => {};
  }

  onForegroundMessage(
    _listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    return () => {};
  }

  onNotificationOpened(
    _listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    return () => {};
  }
}

export class PushNotificationsModule {
  constructor(private readonly adapter: PushNotificationsAdapter) {}

  static createDefault(): PushNotificationsModule {
    return new PushNotificationsModule(new FirebasePushNotificationsAdapter());
  }

  static createNoop(): PushNotificationsModule {
    return new PushNotificationsModule(new NoopPushNotificationsAdapter());
  }

  initialize(): Promise<void> {
    return this.adapter.initialize();
  }

  requestPermission(): Promise<PushPermissionStatus> {
    return this.adapter.requestPermission();
  }

  getDeviceToken(): Promise<string | null> {
    return this.adapter.getDeviceToken();
  }

  onTokenRefresh(listener: (token: string) => void): () => void {
    return this.adapter.onTokenRefresh(listener);
  }

  onForegroundMessage(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    return this.adapter.onForegroundMessage(listener);
  }

  onNotificationOpened(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void {
    return this.adapter.onNotificationOpened(listener);
  }
}

export const pushNotificationsModule = PushNotificationsModule.createDefault();

export function registerBackgroundMessageHandler(
  listener?: (payload: PushNotificationPayload) => Promise<void> | void,
): void {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (!listener) {
      return;
    }

    await listener(toPayload(remoteMessage));
  });
}
