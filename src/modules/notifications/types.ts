export type PushPermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'not-determined'
  | 'provisional';

export interface PushNotificationPayload {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
}

export interface PushNotificationsAdapter {
  initialize(): Promise<void>;
  requestPermission(): Promise<PushPermissionStatus>;
  getDeviceToken(): Promise<string | null>;
  onTokenRefresh(listener: (token: string) => void): () => void;
  onForegroundMessage(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void;
  onNotificationOpened(
    listener: (payload: PushNotificationPayload) => void,
  ): () => void;
}
