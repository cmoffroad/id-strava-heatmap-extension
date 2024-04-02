const manifest = require('../manifest.json');

console.log(`cd dist/`);
console.log(`cp -r ../manifest.json ../icons ../scripts .`);
console.log(`zip ${manifest.version}-chrome.zip manifest.json icons/* scripts/*`);

console.log(`cp ../manifest-firefox.json manifest.json`)
console.log(`zip ${manifest.version}-firefox.zip manifest.json icons/* scripts/*`);

console.log(`rm -rf manifest.json icons scripts`);