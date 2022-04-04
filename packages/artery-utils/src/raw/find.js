import walk from './walk';

function find(node, comparator) {
  return walk(node, (_, keyPath, stop) => {
    if (comparator(node.getIn(keyPath), keyPath)) {
      return stop(keyPath);
    }

    return;
  });
}

export default find;
