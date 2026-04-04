# Push Notifications Setup (FCM + APNs)

This project is now wired for Firebase Messaging with an isolated module under:

- `src/modules/notifications`

## What Is Already Done

- Installed dependencies:
  - `@react-native-firebase/app`
  - `@react-native-firebase/messaging`
- Android:
  - Added Google services Gradle classpath.
  - Added `POST_NOTIFICATIONS` permission.
  - Added conditional application of Google services plugin.
- iOS:
  - Pod install completed with Firebase dependencies.
  - `AppDelegate.swift` now initializes Firebase and registers remote notifications.
  - Foreground notification presentation delegate added.
  - `UIBackgroundModes` includes `remote-notification`.
- Entry point:
  - Background message handler registration added in `index.js`.

## Manual Steps You Must Complete

## 1. Firebase Project

1. Create/select a Firebase project.
2. Add Android app with package id: `com.viet.campusdude`.
3. Add iOS app with bundle id matching Xcode target.
4. Download config files:
   - `google-services.json`
   - `GoogleService-Info.plist`

## 2. Place Config Files

1. Put `google-services.json` in:
   - `android/app/google-services.json`
2. Put `GoogleService-Info.plist` in:
   - `ios/CampusDude/GoogleService-Info.plist`
3. In Xcode, ensure `GoogleService-Info.plist` is added to target `CampusDude`.

## 3. Apple Push Setup (Required for iOS Remote Push)

1. In Apple Developer portal, enable Push Notifications for your App ID.
2. Create APNs auth key (`.p8`) or certificates.
3. Upload APNs key in Firebase Console -> Project Settings -> Cloud Messaging.
4. In Xcode Signing & Capabilities, enable Push Notifications.

## 4. Backend Requirements

1. Save each device FCM token from app to backend.
2. Send push payloads from backend using Firebase Admin SDK or HTTP v1 API.
3. Handle token refresh by updating backend records.

## Module Usage (Isolated)

Use the existing module methods from `src/modules/notifications`:

- `pushNotificationsModule.initialize()`
- `pushNotificationsModule.requestPermission()`
- `pushNotificationsModule.getDeviceToken()`
- `pushNotificationsModule.onTokenRefresh(...)`
- `pushNotificationsModule.onForegroundMessage(...)`
- `pushNotificationsModule.onNotificationOpened(...)`

Suggested place for app-level bootstrap is after auth/session restore, not in screen-level UI.

## Validation Checklist

1. Android build includes Google services plugin (only after `google-services.json` is added).
2. iOS app launches without Firebase config errors.
3. Permission prompts appear as expected.
4. Token is generated and sent to backend.
5. Foreground and background notifications are both received.
