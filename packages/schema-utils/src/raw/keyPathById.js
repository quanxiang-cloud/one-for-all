import find from './find';

function keyPathById(node, id) {
  return find(node, (childNode) => childNode.getIn(['id']) === id);
}

export default keyPathById;
