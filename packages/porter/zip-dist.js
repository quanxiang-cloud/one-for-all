const path = require('path');
const glob = require('glob');
const mkdir = require('mkdirp');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const {
  createReadStream,
  createWriteStream,
} = require('fs');

const sourceFiles = glob.sync('dist/**/*.js');

for (const filePath of sourceFiles) {
  const targetFilePath = path.join('gzip', filePath);
  mkdir.sync(path.dirname(targetFilePath));
  const source = createReadStream(filePath);
  const destination = createWriteStream(targetFilePath);
  const gzip = createGzip();

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  });
}

