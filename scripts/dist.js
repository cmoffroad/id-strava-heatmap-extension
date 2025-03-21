const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST = 'dist';
const MANIFEST = 'manifest.json';
const FOLDERS = ['assets', 'icons', 'lib', 'rules', 'src'];

// Function to copy shared files
function copySharedFiles() {
  const folders = FOLDERS.map((f) => `../${f}`).join(' ');
  execSync(`cd ${DIST} && cp -r ${folders} .`, {
    stdio: 'ignore',
  });
}

// Function to create a zip file
function createZip(zipFileName, manifest) {
  fs.writeFileSync(
    path.join(__dirname, DIST, MANIFEST),
    JSON.stringify(manifest, null, 2)
  );
  const folders = FOLDERS.map((f) => `${f}/*`).join(' ');
  execSync(`cd ${DIST} && zip ${zipFileName} ${MANIFEST} ${folders}`, {
    stdio: 'ignore',
  });
}

// Function to clean up the dist folder
function cleanUp() {
  const folders = FOLDERS.join(' ');
  execSync(`cd ${DIST} && rm -rf ${MANIFEST} ${folders}`, {
    stdio: 'ignore',
  });
}

// Read the original manifest file
const manifest = JSON.parse(fs.readFileSync(MANIFEST));
const { version } = manifest;

// Generate zip filenames
const chromeZip = `${version}-chrome.zip`;
const firefoxZip = `${version}-firefox.zip`;

// Check if version already exists
const distPath = path.join(__dirname, DIST);
if (
  fs.existsSync(path.join(distPath, chromeZip)) ||
  fs.existsSync(path.join(distPath, firefoxZip))
) {
  console.log(`Version ${version} already exists - bump version first.`);
  process.exit(1);
}

// Copy shared files to dist folder
copySharedFiles();

// Create Chrome build
const manifestChrome = { ...manifest };
createZip(chromeZip, manifestChrome);

// Create Firefox build
const manifestFirefox = { ...manifest, ...require('./manifest-firefox.json') };
createZip(firefoxZip, manifestFirefox);

// Clean up dist folder
cleanUp();

console.log('Chrome and Firefox builds created successfully!');
