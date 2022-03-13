import { Seq } from 'immutable';
import byArbitrary from './byArbitrary';
import parent from './parent';

function parentIdPath(node, idOrKeyPath) {
  let keyPath=  byArbitrary(node, idOrKeyPath);
  if (!keyPath) {
    return;
  }

  let idPath = Seq.Indexed();
  while (keyPath.size) {
    keyPath = parent(node, keyPath);
    idPath = idPath.concat([node.getIn(keyPath.concat(['id']))]);
  }

  return idPath.reverse();
}

export default parentIdPath;
