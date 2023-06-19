const manifest = require('../manifest.json');

console.log(`zip dist/${manifest.version}.zip manifest.json icons/* scripts/*`);