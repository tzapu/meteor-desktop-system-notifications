// This propagates the version from package.json to README.md.

const version = require('../../package.json').version;
const fs = require('fs');

let readme = fs.readFileSync('./README.md', 'utf8');
readme = readme.replace(/(version": ")([^"]+)"/gm, `$1${version}"`);
fs.writeFileSync('./README.md', readme);
