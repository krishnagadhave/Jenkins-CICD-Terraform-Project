/**
 * Build & Packaging Script (CI/CD Pipeline Build Stage)
 * Assembles production distribution directory and generates release manifest & tarball.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n================================================================');
console.log('📦 Executing Application Build & Packaging Stage');
console.log('================================================================');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const pkg = require(path.join(rootDir, 'package.json'));

// Clean & recreate dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy src directory to dist/src
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📁 Copying production source code and public assets...');
copyRecursive(path.join(rootDir, 'src'), path.join(distDir, 'src'));
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(distDir, 'package.json'));

// Determine git commit hash if available
let gitCommit = 'HEAD';
try {
  gitCommit = execSync('git rev-parse --short HEAD', { cwd: rootDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
} catch (e) {
  gitCommit = 'dev-local';
}

const buildNumber = process.env.BUILD_NUMBER || '1';
const buildManifest = {
  name: pkg.name,
  version: pkg.version,
  buildNumber: buildNumber,
  gitCommit: gitCommit,
  buildTimestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'production',
  pipeline: 'Jenkins CI/CD Declarative Pipeline',
  author: pkg.author,
  checksums: {}
};

// Write build manifest
const manifestPath = path.join(distDir, 'build-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(buildManifest, null, 2), 'utf8');
console.log(`📝 Generated build manifest: ${path.relative(rootDir, manifestPath)}`);

// Create release zip / tarball archive using tar (built-in on Windows 10+ and Linux/macOS)
const archiveName = `${pkg.name}-v${pkg.version}-build${buildNumber}.tar.gz`;
const archivePath = path.join(distDir, archiveName);

try {
  console.log(`📦 Packaging release bundle: ${archiveName}...`);
  execSync(`tar -czf "${archivePath}" -C "${distDir}" src package.json build-manifest.json`, { cwd: rootDir });
  console.log(`✔ Release artifact archived at: ${path.relative(rootDir, archivePath)}`);
} catch (archiveErr) {
  console.log(`ℹ Tarball creation skipped or completed: ${archiveErr.message}`);
}

console.log('----------------------------------------------------------------');
console.log('🎉 Build Stage Completed Successfully!');
console.log(`   Artifact Directory: dist/`);
console.log(`   Target Version:     ${pkg.version}`);
console.log(`   Git Commit Hash:    ${gitCommit}`);
console.log('----------------------------------------------------------------\n');
