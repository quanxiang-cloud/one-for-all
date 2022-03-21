import { fromJS, Seq } from 'immutable';
import walk from '../walk';

import NODE from './fixtures/node';

test('SchemaUtils_walk', () => {
  const node = fromJS(NODE);
  const paths = walk(node, (reduction, keyPath) => {
    const nodeType = node.getIn(keyPath.concat(['type']));
    const elementPath = `${keyPath.toJS().join('/')}:${nodeType}`;
    if (!reduction) {
      return Seq.Indexed([elementPath]);
    }

    return reduction.concat([elementPath]);
  });

  if (Seq.isSeq(paths)) {
    console.log(paths?.toJS());
  }
});
