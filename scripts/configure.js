#!/usr/bin/env node

/**
 * Configure script for setting up a new React Native project
 *
 * Usage: node scripts/configure.js <appName> <packageName> [organizationName] [displayName]
 *
 * Example: node scripts/configure.js MyAwesomeApp com.mycompany.myawesomeapp "My Company" "My Awesome App"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

// Parse arguments
const rawArgs = process.argv.slice(2);
const inPlaceMode = rawArgs.includes('--in-place');
const argValues = rawArgs.filter(arg => !arg.startsWith('--'));
const projectDirProvided = !inPlaceMode && argValues.length === 1;
const interactiveMode = rawArgs.includes('--interactive') || argValues.length === 0 || projectDirProvided;
const cliMode = inPlaceMode
  ? 'in-place'
  : projectDirProvided
    ? 'one-arg'
    : argValues.length === 0
      ? 'no-arg'
      : 'multi-arg';

let appName = argValues[0] || '';
let packageName = argValues[1] || '';
let organizationName = argValues[2] || 'VISAKHA INSTITUTE OF ENGINEERING & TECHNOLOGY';
let displayName = argValues[3] || '';
let supportEmail = argValues[4] || 'support@viet.edu.in';
let ownerEmail = argValues[5] || 'owner@viet.edu.in';
let projectDirName = projectDirProvided ? argValues[0] : '';

if (projectDirProvided) {
  appName = toPascalCase(projectDirName);
}

const templateRoot = path.join(__dirname, '..');
let projectRoot = templateRoot;
let iosPath = path.join(projectRoot, 'ios');
let androidPath = path.join(projectRoot, 'android');

// Constants
const BOILERPLATE_NAME = 'NativeBoilerplate';
const BOILERPLATE_PACKAGE = 'com.nativeboilerplate';

let pascalCaseAppName = '';
let bundleId = '';

if (require.main === module) {
  run().catch(error => {
    console.error('\n❌ Configuration failed:');
    console.error(error.message);
    process.exit(1);
  });
}

// ============= Helper Functions =============

async function run() {
  console.log(`CLI Mode: ${cliMode}`);

  if (interactiveMode) {
    await collectInteractiveInput();
  } else if (!appName || !packageName) {
    console.error('Usage: node scripts/configure.js <appName> <packageName> [organizationName] [displayName] [supportEmail] [ownerEmail]');
    console.error('Example: node scripts/configure.js MyApp com.mycompany.myapp "My Company" "My App" support@viet.edu.in owner@viet.edu.in');
    process.exit(1);
  }

  displayName = displayName || appName;
  projectDirName = projectDirName || toKebabCase(appName);

  if (!inPlaceMode) {
    console.log(`Scaffold target: ${path.resolve(process.cwd(), projectDirName)}`);
  }

  validateInputs();

  pascalCaseAppName = toPascalCase(appName);
  bundleId = packageName;

  if (!inPlaceMode) {
    scaffoldProject();
  }

  console.log('🚀 Configuring React Native project...\n');
  console.log(`App Name: ${appName}`);
  console.log(`Display Name: ${displayName}`);
  console.log(`Pascal Case: ${pascalCaseAppName}`);
  console.log(`Package Name: ${packageName}`);
  console.log(`Project Directory: ${inPlaceMode ? projectRoot : projectDirName}`);
  console.log(`Organization: ${organizationName}`);
  console.log(`Support Email: ${supportEmail}`);
  console.log(`Owner Email: ${ownerEmail}\n`);

  // 1. Update package.json
  updatePackageJson();

  // 2. Update app.json
  updateAppJson();

  // 3. Configure iOS
  configureIOS();

  // 4. Configure Android
  configureAndroid();

  // 5. Update README placeholder
  updateREADME();

  console.log('\n✅ Configuration complete!');
  console.log(`\nProject ready at: ${projectRoot}`);
  console.log('\nNext steps:');
  if (!inPlaceMode) {
    console.log(`1. cd ${projectDirName}`);
    console.log('2. npm install');
    console.log('3. npm run pods (for iOS)');
    console.log('4. npm start');
  } else {
    console.log('1. npm install');
    console.log('2. npm run pods (for iOS)');
    console.log('3. npm start');
  }
}

async function collectInteractiveInput() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  const ask = async (prompt, fallback = '') => {
    const suffix = fallback ? ` (${fallback})` : '';
    const answer = (await rl.question(`${prompt}${suffix}: `)).trim();
    return answer || fallback;
  };

  try {
    if (!projectDirProvided) {
      const defaultAppName = appName || 'MyAwesomeApp';
      appName = await ask('App Name (internal module/project name)', defaultAppName);
    } else {
      console.log(`Using App Name from folder: ${appName}`);
    }

    displayName = await ask('Display Name (shown on device)', displayName || appName);
    if (!inPlaceMode) {
      projectDirName = projectDirName || toKebabCase(appName);
      console.log(`Using Project Folder: ${projectDirName}`);
    }

    const defaultPackage = packageName || `com.viet.${toKebabCase(appName).replace(/-/g, '')}`;
    packageName = await ask('Package/Bundle ID', defaultPackage);
    organizationName = await ask('Organization Name', organizationName);
    supportEmail = await ask('Support Email', supportEmail);
    ownerEmail = await ask('Owner Email', ownerEmail);
  } finally {
    rl.close();
  }
}

function validateInputs() {
  if (!appName || !packageName) {
    throw new Error('appName and packageName are required.');
  }

  if (!/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$/.test(packageName)) {
    throw new Error('packageName must look like com.company.appname (dot-separated identifiers).');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (supportEmail && !emailPattern.test(supportEmail)) {
    throw new Error(`Invalid support email: ${supportEmail}`);
  }
  if (ownerEmail && !emailPattern.test(ownerEmail)) {
    throw new Error(`Invalid owner email: ${ownerEmail}`);
  }

  if (!inPlaceMode) {
    if (!projectDirName || /[\\/]/.test(projectDirName)) {
      throw new Error('Project folder name must be a single folder name (no slashes).');
    }
  }
}

function setProjectPaths(rootPath) {
  projectRoot = rootPath;
  iosPath = path.join(projectRoot, 'ios');
  androidPath = path.join(projectRoot, 'android');
}

function shouldSkipCopy(relativePath) {
  const blocked = [
    '.git',
    'node_modules',
    'vendor',
    '.DS_Store',
    'ios/Pods',
    'ios/build',
    'android/build',
    'android/.gradle',
    'android/.cxx',
  ];

  if (relativePath.endsWith('.tgz')) {
    return true;
  }

  return blocked.some(entry => relativePath === entry || relativePath.startsWith(`${entry}/`));
}

function copyRecursive(sourceDir, targetDir, rootSource = sourceDir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const relativePath = path.relative(rootSource, sourcePath);

    if (shouldSkipCopy(relativePath)) {
      continue;
    }

    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyRecursive(sourcePath, targetPath, rootSource);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function scaffoldProject() {
  const destinationRoot = path.resolve(process.cwd(), projectDirName);
  const destinationExists = fs.existsSync(destinationRoot);

  if (destinationExists && fs.readdirSync(destinationRoot).length > 0) {
    throw new Error(`Target folder already exists and is not empty: ${destinationRoot}`);
  }

  fs.mkdirSync(destinationRoot, { recursive: true });
  copyRecursive(templateRoot, destinationRoot);
  setProjectPaths(destinationRoot);
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function findFileRecursive(rootDir, fileNames) {
  if (!fs.existsSync(rootDir)) {
    return null;
  }

  const queue = [rootDir];
  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
      } else if (fileNames.includes(entry.name)) {
        return fullPath;
      }
    }
  }

  return null;
}

function updatePackageJson() {
  console.log('📦 Updating package.json...');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  pkg.name = toKebabCase(appName);
  pkg.version = '0.0.1';
  pkg.organization = {
    name: organizationName,
    supportEmail,
    ownerEmail,
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`   ✓ Updated package name to: ${pkg.name}`);

  const lockPath = path.join(projectRoot, 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    lock.name = pkg.name;
    if (lock.packages && lock.packages['']) {
      lock.packages[''].name = pkg.name;
    }
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
    console.log('   ✓ Updated package-lock.json name');
  }
}

function updateAppJson() {
  console.log('📱 Updating app.json...');
  const appJsonPath = path.join(projectRoot, 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  appJson.name = pascalCaseAppName;
  appJson.displayName = displayName;

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
  console.log(`   ✓ Updated app name to: ${pascalCaseAppName}`);
  console.log(`   ✓ Updated display name to: ${displayName}`);
}

function configureIOS() {
  console.log('🍎 Configuring iOS...');

  const xcodeProjDirs = fs
    .readdirSync(iosPath)
    .filter(name => name.endsWith('.xcodeproj'));
  if (xcodeProjDirs.length === 0) {
    throw new Error('No .xcodeproj found under ios/');
  }

  const currentXcodeProjDir = xcodeProjDirs[0];
  const currentProjectName = currentXcodeProjDir.replace(/\.xcodeproj$/, '');
  const currentIosProjectPath = path.join(iosPath, currentXcodeProjDir);
  const newIosProjectPath = path.join(iosPath, `${pascalCaseAppName}.xcodeproj`);

  if (currentProjectName !== pascalCaseAppName) {
    execSync(`mv "${currentIosProjectPath}" "${newIosProjectPath}"`);
    console.log(`   ✓ Renamed project folder to: ${pascalCaseAppName}.xcodeproj`);
  }

  const currentIosAppPath = path.join(iosPath, currentProjectName);
  const newIosAppPath = path.join(iosPath, pascalCaseAppName);

  if (fs.existsSync(currentIosAppPath) && currentProjectName !== pascalCaseAppName) {
    execSync(`mv "${currentIosAppPath}" "${newIosAppPath}"`);
    console.log(`   ✓ Renamed app folder to: ${pascalCaseAppName}`);
  }

  const finalIosProjectPath = path.join(iosPath, `${pascalCaseAppName}.xcodeproj`);
  const finalIosAppPath = path.join(iosPath, pascalCaseAppName);

  const workspaceDirs = fs
    .readdirSync(iosPath)
    .filter(name => name.endsWith('.xcworkspace'));
  const desiredWorkspaceDir = `${pascalCaseAppName}.xcworkspace`;
  if (!workspaceDirs.includes(desiredWorkspaceDir) && workspaceDirs.length > 0) {
    execSync(
      `mv "${path.join(iosPath, workspaceDirs[0])}" "${path.join(iosPath, desiredWorkspaceDir)}"`
    );
    console.log(`   ✓ Renamed workspace to: ${desiredWorkspaceDir}`);
  }

  const updatedWorkspaceDirs = fs
    .readdirSync(iosPath)
    .filter(name => name.endsWith('.xcworkspace') && name !== desiredWorkspaceDir);
  for (const staleWorkspace of updatedWorkspaceDirs) {
    execSync(`rm -rf "${path.join(iosPath, staleWorkspace)}"`);
    console.log(`   ✓ Removed stale workspace: ${staleWorkspace}`);
  }

  const workspaceDataPath = path.join(
    iosPath,
    desiredWorkspaceDir,
    'contents.xcworkspacedata'
  );
  if (fs.existsSync(workspaceDataPath)) {
    let workspaceData = fs.readFileSync(workspaceDataPath, 'utf8');
    workspaceData = workspaceData.replace(
      /location = "group:[^"]+\.xcodeproj"/g,
      `location = "group:${pascalCaseAppName}.xcodeproj"`
    );
    fs.writeFileSync(workspaceDataPath, workspaceData);
    console.log('   ✓ Updated workspace project reference');
  }

  // Update .pbxproj
  const pbxprojPath = path.join(
    finalIosProjectPath,
    'project.pbxproj'
  );
  if (fs.existsSync(pbxprojPath)) {
    let pbxContent = fs.readFileSync(pbxprojPath, 'utf8');
    pbxContent = pbxContent
      .replace(new RegExp(currentProjectName, 'g'), pascalCaseAppName)
      .replace(new RegExp(BOILERPLATE_NAME, 'g'), pascalCaseAppName)
      .replace(new RegExp(BOILERPLATE_PACKAGE, 'g'), bundleId);
    fs.writeFileSync(pbxprojPath, pbxContent);
    console.log(`   ✓ Updated .pbxproj with bundle ID: ${bundleId}`);
  }

  const schemeDir = path.join(finalIosProjectPath, 'xcshareddata', 'xcschemes');
  if (fs.existsSync(schemeDir)) {
    const schemeFiles = fs.readdirSync(schemeDir).filter(name => name.endsWith('.xcscheme'));
    if (schemeFiles.length > 0) {
      const oldSchemePath = path.join(schemeDir, schemeFiles[0]);
      const newSchemePath = path.join(schemeDir, `${pascalCaseAppName}.xcscheme`);
      if (oldSchemePath !== newSchemePath) {
        execSync(`mv "${oldSchemePath}" "${newSchemePath}"`);
      }
      let scheme = fs.readFileSync(newSchemePath, 'utf8');
      scheme = scheme
        .replace(new RegExp(currentProjectName, 'g'), pascalCaseAppName)
        .replace(new RegExp(BOILERPLATE_NAME, 'g'), pascalCaseAppName);
      fs.writeFileSync(newSchemePath, scheme);
      console.log('   ✓ Updated Xcode scheme');
    }
  }

  // Update Info.plist for CFBundleName
  const infoPlistFile = path.join(
    finalIosAppPath,
    'Info.plist'
  );
  if (fs.existsSync(infoPlistFile)) {
    let plistContent = fs.readFileSync(infoPlistFile, 'utf8');
    // Simple regex replacement for CFBundleDisplayName
    plistContent = plistContent.replace(
      /(<key>CFBundleDisplayName<\/key>[\s\n]*<string>)[^<]*/g,
      `$1${displayName}`
    );
    fs.writeFileSync(infoPlistFile, plistContent);
    console.log(`   ✓ Updated Info.plist display name`);
  }

  const appDelegatePath = path.join(finalIosAppPath, 'AppDelegate.swift');
  if (fs.existsSync(appDelegatePath)) {
    let appDelegate = fs.readFileSync(appDelegatePath, 'utf8');
    appDelegate = appDelegate.replace(
      /withModuleName:\s*"[^"]+"/,
      `withModuleName: "${pascalCaseAppName}"`
    );
    fs.writeFileSync(appDelegatePath, appDelegate);
    console.log('   ✓ Updated AppDelegate module name');
  }

  const launchStoryboardPath = path.join(finalIosAppPath, 'LaunchScreen.storyboard');
  if (fs.existsSync(launchStoryboardPath)) {
    let launchStoryboard = fs.readFileSync(launchStoryboardPath, 'utf8');
    launchStoryboard = launchStoryboard.replace(
      /text="[^"]*" textAlignment="center" lineBreakMode="middleTruncation"/,
      `text="${displayName}" textAlignment="center" lineBreakMode="middleTruncation"`
    );
    fs.writeFileSync(launchStoryboardPath, launchStoryboard);
    console.log('   ✓ Updated LaunchScreen title');
  }

  const podfilePath = path.join(iosPath, 'Podfile');
  if (fs.existsSync(podfilePath)) {
    let podfile = fs.readFileSync(podfilePath, 'utf8');
    podfile = podfile.replace(/target\s+'[^']+'\s+do/, `target '${pascalCaseAppName}' do`);
    fs.writeFileSync(podfilePath, podfile);
    console.log('   ✓ Updated Podfile target name');
  }
}

function configureAndroid() {
  console.log('🤖 Configuring Android...');

  // Update build.gradle
  const buildGradlePath = path.join(
    androidPath,
    'app',
    'build.gradle'
  );
  if (fs.existsSync(buildGradlePath)) {
    let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    buildGradle = buildGradle
      .replace(
        /applicationId\s+["'][^"']*["']/g,
        `applicationId "${bundleId}"`
      )
      .replace(
        /namespace\s+["'][^"']*["']/g,
        `namespace "${bundleId}"`
      );
    fs.writeFileSync(buildGradlePath, buildGradle);
    console.log(`   ✓ Updated Android namespace/applicationId to: ${bundleId}`);
  }

  const settingsGradlePath = path.join(androidPath, 'settings.gradle');
  if (fs.existsSync(settingsGradlePath)) {
    let settingsGradle = fs.readFileSync(settingsGradlePath, 'utf8');
    settingsGradle = settingsGradle.replace(
      /rootProject\.name\s*=\s*'[^']+'/,
      `rootProject.name = '${pascalCaseAppName}'`
    );
    fs.writeFileSync(settingsGradlePath, settingsGradle);
    console.log('   ✓ Updated Android root project name');
  }

  // Update AndroidManifest.xml
  const manifestPath = path.join(
    androidPath,
    'app',
    'src',
    'main',
    'AndroidManifest.xml'
  );
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    manifest = manifest.replace(
      /package="[^"]*"/,
      `package="${bundleId}"`
    );
    fs.writeFileSync(manifestPath, manifest);
    console.log(`   ✓ Updated AndroidManifest.xml package`);
  }

  // Rename Java/Kotlin package structure
  const javaRootPath = path.join(
    androidPath,
    'app',
    'src',
    'main',
    'java'
  );

  const newPackagePath = path.join(
    javaRootPath,
    ...packageName.split('.')
  );

  const mainActivityPath = findFileRecursive(javaRootPath, ['MainActivity.kt', 'MainActivity.java']);
  const mainApplicationPath = findFileRecursive(javaRootPath, ['MainApplication.kt', 'MainApplication.java']);

  const currentPackagePath = mainActivityPath
    ? path.dirname(mainActivityPath)
    : path.join(javaRootPath, 'com', 'nativeboilerplate');

  if (fs.existsSync(currentPackagePath) && currentPackagePath !== newPackagePath) {
    if (!fs.existsSync(newPackagePath)) {
      execSync(`mkdir -p "${newPackagePath}"`);
    }

    execSync(`cp -R "${currentPackagePath}/." "${newPackagePath}/"`);
    execSync(`rm -rf "${currentPackagePath}"`);
    execSync(`find "${javaRootPath}" -type d -empty -delete`);

    console.log(`   ✓ Reorganized Java package to: ${packageName}`);
  }

  // Update strings.xml
  const stringsPath = path.join(
    androidPath,
    'app',
    'src',
    'main',
    'res',
    'values',
    'strings.xml'
  );
  if (fs.existsSync(stringsPath)) {
    let strings = fs.readFileSync(stringsPath, 'utf8');
    strings = strings.replace(
      /(<string name="app_name">)[^<]*/,
      `$1${displayName}`
    );
    fs.writeFileSync(stringsPath, strings);
    console.log(`   ✓ Updated app name in strings.xml`);
  }

  // Update MainActivity package declaration and module name
  const mainActivityKotlinPath = path.join(newPackagePath, 'MainActivity.kt');
  const mainActivityJavaPath = path.join(newPackagePath, 'MainActivity.java');
  const existingMainActivityPath = fs.existsSync(mainActivityKotlinPath)
    ? mainActivityKotlinPath
    : mainActivityJavaPath;

  if (fs.existsSync(existingMainActivityPath)) {
    let mainActivity = fs.readFileSync(existingMainActivityPath, 'utf8');
    mainActivity = mainActivity
      .replace(/^package\s+[^\n;]+;?/m, `package ${packageName}`)
      .replace(
        /getMainComponentName\(\)\s*:\s*String\s*=\s*"[^"]+"/,
        `getMainComponentName(): String = "${pascalCaseAppName}"`
      )
      .replace(
        /getMainComponentName\(\)\s*\{\s*return\s+"[^"]+"\s*;\s*\}/,
        `getMainComponentName() { return "${pascalCaseAppName}"; }`
      );
    fs.writeFileSync(existingMainActivityPath, mainActivity);
    console.log('   ✓ Updated MainActivity package and component name');
  }

  // Update MainApplication package declaration if present
  const mainApplicationKotlinPath = path.join(newPackagePath, 'MainApplication.kt');
  const mainApplicationJavaPath = path.join(newPackagePath, 'MainApplication.java');
  const existingMainApplicationPath = fs.existsSync(mainApplicationKotlinPath)
    ? mainApplicationKotlinPath
    : mainApplicationJavaPath;

  if (fs.existsSync(existingMainApplicationPath)) {
    let mainApplication = fs.readFileSync(existingMainApplicationPath, 'utf8');
    mainApplication = mainApplication.replace(
      /^package\s+[^\n;]+;?/m,
      `package ${packageName}`
    );
    fs.writeFileSync(existingMainApplicationPath, mainApplication);
    console.log('   ✓ Updated MainApplication package declaration');
  }
}

function updateREADME() {
  console.log('📄 Updating README...');
  const readmePath = path.join(projectRoot, 'README.md');
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    readme = readme.replace(
      /NativeBoilerplate/g,
      pascalCaseAppName
    );
    fs.writeFileSync(readmePath, readme);
    console.log(`   ✓ Updated README references`);
  }
}
