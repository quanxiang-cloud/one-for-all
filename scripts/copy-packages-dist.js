const path = require('path');
const glob = require('glob');
const fs = require('fs');
const mkdir = require('mkdirp');

function gatherDist(package) {
  const packageJSON = path.join(package, 'package.json');
  const rawJSON = fs.readFileSync(packageJSON, { encoding: 'utf-8' });
  const { version, name } = JSON.parse(rawJSON);

  const distFiles = glob.sync(`${package}/dist/**/*`);
  return {
    version,
    name,
    files: distFiles.map((filePath) => {
      return [
        filePath,
        filePath.slice(`${package}/dist/`.length),
      ];
    }),
  };
}

function cpPackage({ name, version, files }) {
  files.forEach(([source, target]) => {
    const destination = `packages/example/dist/${name}@${version}/${target}`;
    mkdir.sync(path.dirname(destination));
    console.log('copying file:', source, 'to:', destination);
    fs.copyFileSync(source, destination);
  });
}

glob.sync('./packages/*', { ignore: './packages/example' })
  .map((package) => gatherDist(package))
  .forEach(cpPackage);
