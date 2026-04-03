# Configuration Guide

This boilerplate includes a powerful `configure.js` script that **automatically renames everything** in your React Native project—without touching Xcode or Android Studio.

## What gets configured automatically

The configuration script updates:

### 1. **Package metadata**

- `package.json` - Name field
- `app.json` - Name and displayName

### 2. **iOS** (no Xcode needed)

- ✓ Renames `.xcodeproj` folder
- ✓ Renames app folder
- ✓ Updates bundle ID in `.pbxproj`
- ✓ Updates display name in `Info.plist`

### 3. **Android** (no Android Studio needed)

- ✓ Updates `applicationId` in `build.gradle`
- ✓ Updates package declaration in `AndroidManifest.xml`
- ✓ Reorganizes Java package structure
- ✓ Updates app name in `strings.xml`
- ✓ Updates `MainActivity.java` package

### 4. **Documentation**

- ✓ Updates `README.md` references

## Usage

### Option 1: During first-time setup

```bash
npm run configure MyAwesomeApp com.mycompany.myawesomeapp "My Company"
```

Arguments:

- `MyAwesomeApp` - Display name (will be shown to users)
- `com.mycompany.myawesomeapp` - Package/Bundle ID (reverse domain notation)
- `"My Company"` - Organization name (optional, for future use)

### Option 2: Using the NPX CLI (coming soon)

```bash
npx create-native-app MyAwesomeApp
```

The CLI will ask interactive questions and call the configure script automatically.

## Example workflow

```bash
# Clone/use this boilerplate
git clone <repo> my-new-app
cd my-new-app

# Configure for your app (no Xcode or Android Studio!)
npm run configure MyApp com.mycompany.myapp

# Install dependencies
npm install

# Install iOS pods
npm run pods

# Start development
npm start
```

## What NOT to do

❌ **Do NOT** open Xcode or Android Studio to rename things  
❌ **Do NOT** manually edit native code files  
✅ **DO** use the configure script instead

## Troubleshooting

**Issue: Script fails on iOS rename**

- Ensure iOS project exists in `ios/` folder

**Issue: Android package not updating**

- Check that `android/app/build.gradle` has `applicationId` field
- Verify `AndroidManifest.xml` is in `android/app/src/main/`

**Issue: Need to reconfigure?**

- Reset to original state by checking out from git
- OR manually restore `NativeBoilerplate` folder names first

## Advanced: Manual configuration (if automation fails)

If you prefer manual setup, here are the files to update:

### iOS

1. Rename `ios/NativeBoilerplate` → `ios/YourAppName`
2. Rename `ios/NativeBoilerplate.xcodeproj` → `ios/YourAppName.xcodeproj`
3. Open in Xcode and update Bundle Identifier

### Android

1. Update `android/app/build.gradle`: `applicationId "com.yourcompany.yourapp"`
2. Update `android/app/src/main/AndroidManifest.xml`: `package="com.yourcompany.yourapp"`
3. Move Java files: `src/main/java/com/yourcompany/yourapp/...`
4. Update `android/app/src/main/res/values/strings.xml`: app name

### All platforms

1. Update `package.json`: `"name": "your-app"`
2. Update `app.json`: `"name"` and `"displayName"`
