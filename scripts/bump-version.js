#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageLockPath = path.join(projectRoot, 'package-lock.json');

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version || '');
  if (!match) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function toVersion(v) {
  return `${v.major}.${v.minor}.${v.patch}`;
}

function readPreviousPackageJson() {
  try {
    const raw = execSync('git show HEAD~1:package.json', {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function setOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) {
    return;
  }
  fs.appendFileSync(outputFile, `${name}=${value}\n`);
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const previousPkg = readPreviousPackageJson();

  const oldVersion = pkg.version;
  const version = parseVersion(oldVersion);

  const releaseDateChanged =
    previousPkg !== null && previousPkg.releaseDate !== pkg.releaseDate;

  let bumpType = 'patch';
  if (releaseDateChanged) {
    bumpType = 'major';
    version.major += 1;
    version.minor = 0;
    version.patch = 0;
  } else {
    version.patch += 1;
  }

  const newVersion = toVersion(version);
  const newTag = `v${newVersion}`;

  pkg.version = newVersion;
  writeJson(packageJsonPath, pkg);

  if (fs.existsSync(packageLockPath)) {
    const lock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    lock.version = newVersion;
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = newVersion;
      if (pkg.name) {
        lock.packages[''].name = pkg.name;
      }
    }
    if (pkg.name) {
      lock.name = pkg.name;
    }
    writeJson(packageLockPath, lock);
  }

  console.log(`oldVersion=${oldVersion}`);
  console.log(`newVersion=${newVersion}`);
  console.log(`bumpType=${bumpType}`);
  console.log(`releaseDateChanged=${releaseDateChanged}`);

  setOutput('old_version', oldVersion);
  setOutput('new_version', newVersion);
  setOutput('new_tag', newTag);
  setOutput('bump_type', bumpType);
  setOutput('release_date_changed', String(releaseDateChanged));
}

main();
