import { List } from 'immutable';
import walk from './walk';

function filter(node, comparator) {
  let res = List();
  walk(node, (_, keyPath) => {
    if (comparator(node.getIn(keyPath), keyPath)) {
      res = res.push(keyPath);
      return;
    }

    return;
  });

  return res;
}

export default filter;
