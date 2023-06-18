const config = require('../package.json');

console.log(`zip dist/${config.version}.zip manifest.json icons/* scripts/*`);