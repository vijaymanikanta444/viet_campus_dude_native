# create-viet-native-app

Interactive CLI for setting up this React Native template with your own app name, display name, package/bundle ID, and organization metadata.

## Usage

### Local (inside this repository)

```sh
npm run configure:interactive
```

### As published CLI (npx)

```sh
npx create-viet-native-app
```

The interactive wizard asks for:

- App Name
- Display Name
- Package/Bundle ID
- Organization Name
- Support Email
- Owner Email

After setup, install dependencies and run:

```sh
npm install
npm run pods
npm run ios
npm run android
```

## Publish to npm

```sh
npm login
npm publish
```

Make sure the package name `create-viet-native-app` is available in npm before publishing.

# React Native Template Notes

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# App Icon Generation (Android & iOS)

This project uses [`rn-app-icons`](https://www.npmjs.com/package/rn-app-icons) (already included in package.json) to generate all required app icon sizes for both Android and iOS from a single source image.

## Steps to Generate App Icons

1. **Place your base icon image:**

   - Prepare a 1024x1024 PNG image (no transparency, square) as your app icon.
   - Place it in the `src/assets` folder (e.g., `src/assets/icon.png`).

2. **Run rn-app-icons using npx:**

   ```sh
   npx rn-app-icons src/assets/icon.png
   ```

   This will automatically generate and overwrite all required icon files for both Android and iOS platforms in the correct locations.

3. **Rebuild your app:**
   - For changes to take effect, rebuild your app:
     ```sh
     npm run android
     npm run ios
     ```

> For more details and advanced options, see the [rn-app-icons documentation](https://www.npmjs.com/package/rn-app-icons).
