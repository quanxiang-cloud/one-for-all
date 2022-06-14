import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJSON = require('../package.json');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const cwd = process.cwd();

const BASE_PATH = path.join(cwd, './artery-configs/**/artery-config.js');

const OUT_PATH_LATEST = path.join(cwd, `./dist/${packageJSON.name}@latest/`);
const OUT_PATH_CURRENT = path.join(cwd, `./dist/${packageJSON.name}@${packageJSON.version}/`);

const OUT_FILE_MANIFEST = 'manifest.json';
const OUT_FILE_PROPS_SPEC = 'props-spec.json';

async function getArteryConfig() {
  const filePaths = await glob(BASE_PATH);
  const AllManifest = {};
  const AllPropsSpec = {};

  await Promise.all(
    filePaths.map(async (filePath) => {
      const interfaces = await import(filePath);
      const arteryConfig = interfaces.default;
      const { key, manifest, propsSpec } = arteryConfig;
      AllManifest[key] = manifest;
      AllPropsSpec[key] = propsSpec;
    }),
  );

  [OUT_PATH_LATEST, OUT_PATH_CURRENT].forEach((paths) => {
    fs.writeFile(path.join(paths, OUT_FILE_MANIFEST), JSON.stringify(AllManifest), err => err && console.log(err));
    fs.writeFile(path.join(paths, OUT_FILE_PROPS_SPEC), JSON.stringify(AllPropsSpec), err => err && console.log(err));
  });
}

getArteryConfig();
