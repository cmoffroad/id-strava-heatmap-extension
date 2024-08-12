const chrome = require('../manifest.json');
console.log(`cd dist/`);
console.log(`cp -r ../manifest.json ../icons ../scripts .`);
console.log(`zip ${chrome.version}-chrome.zip manifest.json icons/* scripts/*`);

const firefox = require('../manifest-firefox.json');
console.log(`cp ../manifest-firefox.json manifest.json`)
console.log(`zip ${firefox.version}-firefox.zip manifest.json icons/* scripts/*`);

console.log(`rm -rf manifest.json icons scripts`);