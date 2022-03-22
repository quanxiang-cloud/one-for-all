const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const svgSpreact = require('svg-spreact');
const svgoConfig = require('./svgo.config');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const { classificationByFill } = require('./classification-svg');
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

const getSpriteAndName = async function (colorMark) {
  const svgArr = await getAllSvgContent();
  const classificationRes = classificationByFill(svgArr, true);
  const { afterClassificationName, iconNames } = getSvgNameByClassification(classificationRes)
  const afterClassificationSvg = classificationRes.map(singleClassification => {
    const svgCont = []
    singleClassification.forEach(({ cont }) => svgCont.push(cont))
    return svgCont
  })

  if (colorMark === undefined) {
    const iconID = (n_1) => [].concat(...iconNames)[n_1];
    const { defs } = await svgSpreact([].concat(...afterClassificationSvg), { tidy: true, processId: iconID, svgoConfig });
    return {
      names: afterClassificationName,
      svgStr: defs.replace(/currentColor/g, 'none').replace(new RegExp(WILL_REPLACE_COLOR, 'g'), 'currentColor')
    };
  } else {
    const iconID = (n_1) => iconNames[colorMark][n_1];
    const { defs } = await svgSpreact(afterClassificationSvg[colorMark], { tidy: true, processId: iconID, svgoConfig });
    return {
      names: afterClassificationName.slice(colorMark, colorMark + 1),
      svgStr: defs.replace(/currentColor/g, 'none').replace(new RegExp(WILL_REPLACE_COLOR, 'g'), 'currentColor')
    };
  }
}

/**
 * 生成雪碧图和对应 icon 的name
 * @param {undefined | 0 | 1 | 2} colorMark undefined: 将所有的svg生成到一张雪碧图上，0: 只生成单色icon的雪碧图，1: 只生成双色icon的雪碧图， 2: 只生成彩色icon的雪碧图
 */
const generateSpriteAndName = async function (colorMark) {
  try {
    const { names, svgStr } = await getSpriteAndName(colorMark);
    writeSvgName(JSON.stringify(names))
    writeSprite(svgStr)
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
    console.log(error)    
  }
}
const writeSprite = async function (svgStr) {
  const pathName = 'src/sprite.svg';
  const spriteFile = path.join(basePath, pathName);
  try {
    mkdirp.sync(path.dirname(spriteFile));
    fs.writeFileSync(spriteFile, svgStr);
  } catch (error) {
    console.log(error)
  }
}
const getSvgNameByClassification = function(classificationRes) {
  const afterClassificationName = []
  const iconNames = []
  classificationRes.map(singleClassification => {
    const categoryRes = {}
    const categoryNames = []
    singleClassification.forEach(({ file }) => {
      const pathSplit = file.split('/')
      const currentCategory = pathSplit[pathSplit.length - 2]
      const svgName = path.basename(file).replace('.svg', '')
      if (categoryRes[currentCategory]) {
        categoryRes[currentCategory].push(svgName)
      } else {
        categoryRes[currentCategory] = [svgName]
      }
      categoryNames.push(svgName)
    })
    afterClassificationName.push(categoryRes)
    iconNames.push(categoryNames)
  })
  return {
    afterClassificationName,
    iconNames
  }
}

module.exports = {
  getSprite,
  generateSpriteAndName,
};
