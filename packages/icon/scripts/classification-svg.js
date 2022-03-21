const rphtml = require('rphtml');

function getDomTree(source) {
  if (!source) return;
  const domTree = [];
  source.forEach(({ meta, childs }) => {
    if (!meta) return;
    const currentDom = {};
    (currentDom.name = meta.name), (currentDom.attrs = {});
    meta.attrs.forEach((attr) => {
      const keyKey = Object.keys(attr.key)[0];
      const valueKey = Object.keys(attr.value)[0];
      currentDom.attrs[attr.key[keyKey]] = attr.value[valueKey];
    });
    if (childs) {
      currentDom.children = getDomTree(childs);
    }
    domTree.push(currentDom);
  });
  return domTree;
}

function getAttrOfFillValue(domTree, isRoot) {
  const fillSet = [];
  domTree.forEach(({ attrs, children }) => {
    if (!isRoot) {
      if (attrs.fill) {
        !fillSet.includes(attrs.fill) && fillSet.push(attrs.fill);
      } else {
        fillSet.push('fill');
      }
    }
    if (children) {
      const childrenFillSet = getAttrOfFillValue(children);
      fillSet.push(...childrenFillSet);
    }
  });
  return [...new Set(fillSet)];
}

function classificationByFill(svgArr, dropSingleColor) {
  const classification = [[], [], []];
  svgArr.forEach((svgCode) => {
    const ast = rphtml.parse(svgCode.cont, {
      allow_self_closing: true,
      allow_fix_unclose: false,
      case_sensitive_tagname: false,
    });
    const sameColor = ['none', 'currentColor'];
    const fillValue = getAttrOfFillValue(getDomTree(ast.toJson().childs), true).filter((value) => {
      if (sameColor.includes(value)) {
        return false;
      } else {
        return value.indexOf('url(') !== 0;
      }
    });
		// fillValue.length 代表颜色值个数（1: 单色，2:双色，>2:彩色）
    if (fillValue.length === 1 && dropSingleColor && fillValue[0] !== 'fill') {
      svgCode.cont = svgCode.cont.replace(new RegExp(`fill="${fillValue[0]}"`, 'g'), '');
    }
    if (fillValue.length === 2) {
      if (fillValue[0] === 'fill') fillValue.push(fillValue.shift());
      svgCode.cont = svgCode.cont.replace(new RegExp(fillValue[0], 'g'), '#475569');
      svgCode.cont = svgCode.cont.replace(new RegExp(`fill="${fillValue[1]}"`, 'g'), '');
    }
    classification[Math.min(fillValue.length - 1, 2)].push(svgCode);
  });
  return classification;
}

module.exports = {
  classificationByFill,
};
