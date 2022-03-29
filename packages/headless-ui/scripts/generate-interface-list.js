import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJSON = require('../package.json');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const BASE_PATH = path.join(process.cwd(), './src/shared/**/style-config-interface.json');

async function getInterfaces() {
  const filePaths = await glob(BASE_PATH);
  const interfaceList = [];
  filePaths.forEach((filePath) => {
    const interfaces = fs.readFileSync(filePath, 'utf-8');
    interfaceList.push(JSON.parse(interfaces));
  });

  const str = JSON.stringify(interfaceList);

  const outPath = path.join(process.cwd(), `./dist/${packageJSON.name}@latest/components-interface.json`);
  const outPath2 = path.join(process.cwd(), `./dist/${packageJSON.name}@${packageJSON.version}/components-interface.json`);
  fs.writeFile(outPath, str, function (err) {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(outPath2, str, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

getInterfaces();
