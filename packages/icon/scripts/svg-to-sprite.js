const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const svgSpreact = require('svg-spreact');
const svgoConfig = require('./svgo.config');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const { uniteFillColor } = require('./classification-svg');
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

async function getSprite() {
  const svgArr = await getAllSvgContent();
  const iconNames = svgArr.map(({ file }) => path.basename(file).replace('.svg', ''));
  const iconID = (n_1) => iconNames[n_1];
  const input = svgArr.map((v) => v.cont);
  const { defs } = await svgSpreact(input, { tidy: true, processId: iconID, svgoConfig });
  // replace #475569 by currentColor in order to be styled by css
  return defs.replace(/currentColor/g, 'none').replace(new RegExp(WILL_REPLACE_COLOR, 'g'), 'currentColor');
}

function generateHash(value) {
  const cryptoCreate = crypto.createHash('md5');
  cryptoCreate.update(value);
  return cryptoCreate.digest('hex');
}

const generateSpriteAndName = async function () {
  const svgArr = await getAllSvgContent();
  uniteFillColor(svgArr);
  const { categoryNames, iconNames } = getSvgNameByCategory(svgArr);
  const iconID = (n_1) => iconNames[n_1];
  const input = svgArr.map((v) => v.cont);
  const { defs } = await svgSpreact(input, { tidy: true, processId: iconID, svgoConfig });
  const svgStr = defs
    .replace(/currentColor/g, 'none')
    .replace(new RegExp(WILL_REPLACE_COLOR, 'g'), 'currentColor');
  try {
    writeSvgName(JSON.stringify(categoryNames));
    writeSprite(svgStr);
  } catch (err) {
    console.error(err);
  }
};

const writeSvgName = async function (nameStr) {
  const pathName = `dist/${packageJSON.name}@${packageJSON.version}/svgNameMap.json`;
  const svgNameFile = path.join(basePath, pathName);
  try {
    mkdirp.sync(path.dirname(svgNameFile));
    fs.writeFileSync(svgNameFile, nameStr);
  } catch (error) {
    console.log(error);
  }
};
const writeSprite = async function (svgStr) {
  const pathName = 'src/sprite.svg';
  const spriteFile = path.join(basePath, pathName);
  try {
    mkdirp.sync(path.dirname(spriteFile));
    fs.writeFileSync(spriteFile, svgStr);
  } catch (error) {
    console.log(error);
  }
};
const getSvgNameByCategory = function (svgArr) {
  const categoryNames = {};
  const iconNames = [];
  svgArr.forEach(({ file }) => {
    const pathSplit = file.split('/');
    const currentCategory = pathSplit[pathSplit.length - 2];
    const svgName = path.basename(file).replace('.svg', '');
    if (categoryNames[currentCategory]) {
      categoryNames[currentCategory].push(svgName);
    } else {
      categoryNames[currentCategory] = [svgName];
    }
    iconNames.push(svgName);
  });
  return {
    categoryNames,
    iconNames,
  };
};

module.exports = {
  getAllSvgContent,
  getSprite,
  generateSpriteAndName,
};
