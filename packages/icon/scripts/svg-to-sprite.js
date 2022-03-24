const path = require('path');
const fs = require('fs');
const svgSpreact = require('svg-spreact');
const svgoConfig = require('./svgo.config');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const packageJSON = require('../package.json');

const { WILL_REPLACE_COLOR } = require('./consts');

const basePath = process.cwd();

function getFileContent(filePath) {
  return promisify(fs.readFile)(filePath, { encoding: 'utf-8' });
}

async function getFileNames() {
  const filePath = path.join(basePath, './src/svgs/**/*.svg');
  const files = await glob(filePath);
  return files.filter((f) => f.endsWith('.svg'));
}

async function getAllSvgContent() {
  const files = await getFileNames();
  const conts = await Promise.all(files.map((f) => getFileContent(f)));
  return conts.map((cont, idx) => {
    return {
      file: files[idx],
      cont,
    };
  });
}

function getSvgNameByCategory(svgArr) {
  const categoryNames = {};
  svgArr.forEach(({ file }) => {
    const currentCategory = path.basename(path.dirname(file));
    const svgName = path.basename(file, '.svg');
    if (categoryNames[currentCategory]) {
      categoryNames[currentCategory].push(svgName);
    } else {
      categoryNames[currentCategory] = [svgName];
    }
  });
  return categoryNames;
}

async function writeSvgNameToFile(svgNameStr) {
  const pathName = `dist/${packageJSON.name}@${packageJSON.version}/svgNameMap.json`;
  const svgNameMapFile = path.join(basePath, pathName);
  try {
    mkdirp.sync(path.dirname(svgNameMapFile));
    fs.writeFileSync(svgNameMapFile, svgNameStr);
  } catch (error) {
    console.log(error);
  }
}

async function writeSpriteToFile(svgStr) {
  const pathName = 'src/sprite.svg';
  const spriteFile = path.join(basePath, pathName);
  try {
    mkdirp.sync(path.dirname(spriteFile));
    fs.writeFileSync(spriteFile, svgStr);
  } catch (error) {
    console.log(error);
  }
}

async function generateSpriteAndNameMap() {
  const svgArr = await getAllSvgContent();

  const categoryNames = getSvgNameByCategory(svgArr);
  const iconNames = [].concat(...Object.values(categoryNames));

  const iconID = (n_1) => iconNames[n_1];
  const input = svgArr.map((v) => v.cont);
  const { defs } = await svgSpreact(input, { tidy: true, processId: iconID, svgoConfig });

  const svgStr = defs
    .replace(/currentColor/g, 'none')
    .replace(new RegExp(WILL_REPLACE_COLOR, 'g'), 'currentColor');
  try {
    writeSvgNameToFile(JSON.stringify(categoryNames));
    writeSpriteToFile(svgStr);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  generateSpriteAndNameMap,
};
