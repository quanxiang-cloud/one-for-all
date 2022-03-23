const fs = require('fs');
const { getAllSvgContent } = require('./svg-to-sprite');
const { classificationByFill } = require('./classification-svg');

const dropMultiColorIcon = async function () {
  const svgArr = await getAllSvgContent();
  const classificationRes = classificationByFill(svgArr, true);
  const multiColorIconFiles = getSvgFileByClassification(classificationRes).slice(1);

  [].concat(...multiColorIconFiles).forEach(async (file) => {
    const dropPath = await unlinkFile(file);
    console.log('Drop the file: ' + dropPath);
  });
};

const getSvgFileByClassification = function (classificationRes) {
  return classificationRes.map((singleClassification) => {
    return singleClassification.map(({ file }) => file);
  });
};

const unlinkFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) reject(error);
      else resolve(path);
    });
  });
};

dropMultiColorIcon();
