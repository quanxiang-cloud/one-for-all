import { Seq } from 'immutable';
import keyPathById from './keyPathById';

function byArbitrary(node, idOrKeyPath) {
  if (Seq.isSeq(idOrKeyPath)) {
    return idOrKeyPath;
  }

  return keyPathById(node, idOrKeyPath);
}

export default byArbitrary;
