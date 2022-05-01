import byArbitrary from './byArbitrary';
import parent from './parent';
import _insertChildAt from './_insertChildAt';

function _insertRightSiblingTo(root, idOrKeyPath, node) {
  const referenceKeyPath = byArbitrary(root, idOrKeyPath);
  if (!referenceKeyPath) {
    return;
  }

  const referenceNodeIndex = referenceKeyPath.last();
  if (typeof referenceNodeIndex !== 'number') {
    return;
  }

  const parentKeyPath = parent(root, referenceKeyPath);
  return _insertChildAt(root, parentKeyPath, referenceNodeIndex + 1, node);
}

export default _insertRightSiblingTo;
