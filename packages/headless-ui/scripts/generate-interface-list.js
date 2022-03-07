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

  var outPath = path.join(process.cwd(), `./dist/${packageJSON.name}@latest/components-interface.json`);
  fs.writeFile(outPath, JSON.stringify(interfaceList), function (err) {
    if (err) {
      console.log(err);
    }
  });
}

getInterfaces();
