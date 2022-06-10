import walk from './walk';

function toNumberPath(keyPath) {
  return keyPath.map((v) => {
    if (typeof v === 'number') {
      return v;
    }

    return 0;
  });
}

/**
 *
 * @param {Immutable} node
 * @returns flattened keyPath/node pair list
 */
function flat(node) {
  const reduction = walk(node, (reduction, keyPath) => {
    if (!reduction) {
      reduction = [];
    }

    reduction.push({ keyPath, node: node.getIn(keyPath), numberPath: toNumberPath(keyPath) });
    return reduction;
  });

  reduction.sort(({ numberPath: numberPathA }, { numberPath: numberPathB }) => {
    if (numberPathA.size === 0) {
      return -1;
    }

    if (numberPathB.size === 0) {
      return 1;
    }

    for (let index = 0; index < Math.min(numberPathA.size, numberPathB.size); index++) {
      if (numberPathB.get(index) === numberPathA.get(index)) {
        continue
      }

      return numberPathA.get(index) - numberPathB.get(index);
    }

    return numberPathA.size < numberPathB.size ? -1 : 1;
  });

  return reduction.map(({ keyPath, node }) => [keyPath, node]);
}

export default flat;
