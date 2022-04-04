import byArbitrary from './byArbitrary';

function parent(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  if (!keyPath || !keyPath.size) {
    return;
  }

  if (typeof keyPath.last() === 'number') {
    return keyPath.slice(0, -2);
  }

  return keyPath.slice(0, -1);
}

export default parent;
