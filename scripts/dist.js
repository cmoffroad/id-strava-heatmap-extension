const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { execSync } = require('child_process');

const DIST = path.join(process.cwd(), 'dist');
const MANIFEST = 'manifest.json';
const FOLDERS = ['assets', 'icons', 'lib', 'rules', 'src'];

// Function to copy shared files
function copySharedFiles() {
  const folders = FOLDERS.map((folder) => path.join('..', folder)).join(' ');
  execSync(`cd ${DIST} && cp -r ${folders} .`, { stdio: 'ignore' });
}

// Function to create a zip file
function createZip(zipFileName, manifest) {
  fs.writeFileSync(path.join(DIST, MANIFEST), JSON.stringify(manifest, null, 2));

  const folders = FOLDERS.map((folder) => path.join(folder, '*')).join(' ');
  execSync(`cd ${DIST} && zip -r ${zipFileName} ${MANIFEST} ${folders}`, {
    stdio: 'ignore',
  });
}

// Function to clean up the dist folder
function cleanUp() {
  const folders = FOLDERS.map((folder) => path.join(DIST, folder)).join(' ');
  execSync(`cd ${DIST} && rm -rf ${MANIFEST} ${folders}`, { stdio: 'ignore' });
}

// Read the original manifest file
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
const { version } = manifest;

// Generate zip filenames
const chromeZip = `${version}-chrome.zip`;
const firefoxZip = `${version}-firefox.zip`;

// Set up the CLI options
const options = program
  .option('-f, --force', 'Force recreate zip even if version already exists')
  .parse(process.argv)
  .opts();

// Check if version already exists
if (
  (fs.existsSync(path.join(DIST, chromeZip)) ||
    fs.existsSync(path.join(DIST, firefoxZip))) &&
  !options.force
) {
  console.log(
    `Version ${version} already exists - bump version first or use --force option.`
  );
  process.exit(1);
}

// Copy shared files to dist folder
copySharedFiles();

// Create Chrome build
const manifestChrome = { ...manifest };
createZip(chromeZip, manifestChrome);

// Create Firefox build
const manifestFirefox = {
  ...manifest,
  ...JSON.parse(fs.readFileSync('manifest-firefox.json', 'utf-8')),
};
createZip(firefoxZip, manifestFirefox);

// Clean up dist folder
cleanUp();

console.log(`Chrome and Firefox v${version} builds created successfully!`);
