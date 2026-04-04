# Notifications Module

This module is intentionally isolated from the app flow.

Current state:

- Firebase Messaging adapter is implemented in this module.
- No screens or navigators import this module yet.
- Background handler can be registered from app entrypoint (`index.js`).

Integration points:

1. Call `pushNotificationsModule.initialize()` during app bootstrap.
2. Call `pushNotificationsModule.requestPermission()` when user opts in.
3. Read token using `pushNotificationsModule.getDeviceToken()` and send it to backend.
4. Subscribe to foreground and open events via `onForegroundMessage` and `onNotificationOpened`.
