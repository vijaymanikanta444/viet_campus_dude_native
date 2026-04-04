# Biometric Reintroduction Notes

Use this file as the checklist for adding biometric unlock back into the app later.

## Dependencies

- Add `react-native-biometrics` back to `package.json`.
- Run `npm install` and refresh the iOS pods with `cd ios && pod install`.

## iOS Setup

- Add the Face ID usage string back to `ios/CampusDude/Info.plist`.
- If you need device credential fallback on iOS, confirm the library version supports it.

## Android Setup

- Verify autolinking picks up the native module after install.
- Rebuild the app so Android generates fresh package metadata and manifest merge outputs.

## App Flow

- Add the biometric prompt in the screen or navigator where unlock should happen.
- Store only a simple enabled flag in async storage if you need to remember the preference.
- Keep the fallback clear: either device credential/passcode or a separate app PIN, but not both unless the UX explicitly needs it.

## Testing Checklist

- Confirm the prompt appears on supported iOS and Android devices.
- Confirm fallback behavior when biometrics fail or are unavailable.
- Confirm the app still launches normally on devices without biometric hardware.
