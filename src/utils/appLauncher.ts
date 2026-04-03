import { Linking, Platform } from 'react-native';

export type AppItem = {
  id: string;
  name: string;
  iosUrl?: string;
  iosStoreId?: string;
  androidPackage?: string;
  androidStoreUrl?: string;
};

const APPS: AppItem[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    iosUrl: 'youtube://',
    iosStoreId: '544007664',
    androidPackage: 'com.google.android.youtube',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=com.google.android.youtube',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    iosUrl: 'instagram://',
    iosStoreId: '389801252',
    androidPackage: 'com.instagram.android',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=com.instagram.android',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    iosUrl: 'twitter://',
    iosStoreId: '333903271',
    androidPackage: 'com.twitter.android',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=com.twitter.android',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    iosUrl: 'whatsapp://',
    iosStoreId: '310633997',
    androidPackage: 'com.whatsapp',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=com.whatsapp',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    iosUrl: 'tg://',
    iosStoreId: '686449807',
    androidPackage: 'org.telegram.messenger',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=org.telegram.messenger',
  },
  {
    id: 'github',
    name: 'GitHub',
    iosStoreId: '1477376905',
    androidPackage: 'com.github.android',
    androidStoreUrl:
      'https://play.google.com/store/apps/details?id=com.github.android',
  },
];

export async function launchApp(app: AppItem): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      // Try native app first.
      if (app.iosUrl) {
        try {
          await Linking.openURL(app.iosUrl);
          return;
        } catch (error) {
          const message =
            error instanceof Error ? error.message.toLowerCase() : '';

          // User dismissed iOS confirmation alert. Stay in current app.
          if (message.includes('cancel')) {
            throw new Error('USER_CANCELLED');
          }

          // Continue to App Store fallback.
        }
      }

      // Fall back to App Store.
      if (app.iosStoreId) {
        const appStoreDeepLinkPrimary = `itms-apps://apps.apple.com/app/id${app.iosStoreId}`;
        const appStoreDeepLinkSecondary = `itms-apps://itunes.apple.com/app/id${app.iosStoreId}`;
        const appStoreWebUrl = `https://apps.apple.com/app/id${app.iosStoreId}`;

        try {
          await Linking.openURL(appStoreDeepLinkPrimary);
          return;
        } catch {
          try {
            await Linking.openURL(appStoreDeepLinkSecondary);
            return;
          } catch {
            // Simulator has no App Store app, so fall back to web.
            await Linking.openURL(appStoreWebUrl);
            return;
          }
        }
      }

      throw new Error(
        `App "${app.name}" is not installed and cannot be opened.`,
      );
    } else if (Platform.OS === 'android') {
      if (app.androidPackage) {
        const androidUrl = `market://details?id=${app.androidPackage}`;
        try {
          await Linking.openURL(androidUrl);
          return;
        } catch (marketError) {
          // Fallback to web URL if Play Store app not available
          if (app.androidStoreUrl) {
            try {
              await Linking.openURL(app.androidStoreUrl);
              return;
            } catch {
              throw new Error(`Unable to open "${app.name}".`);
            }
          }
          throw marketError;
        }
      }
    }

    throw new Error(
      `Unable to open "${app.name}". App configuration incomplete.`,
    );
  } catch (error) {
    throw error;
  }
}

export function getAvailableApps(): AppItem[] {
  return APPS;
}
