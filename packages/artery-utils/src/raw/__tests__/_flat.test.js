import { fromJS } from 'immutable';
import flat from '../_flat';

import NODE from './fixtures/node';

test('flat', () => {
  const pairs = flat(fromJS(NODE));

  const idPairs = pairs.map(([keyPath, node]) => {
    return [keyPath.toJS().join('/'), node.getIn(['id'])];
  });

  expect(idPairs).toMatchSnapshot();
});
