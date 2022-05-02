import { getChildNodeKey } from "./utils";

export default function getFirstLevelConcreteChildren(parent) {
  const childrenKey = getChildNodeKey(parent);
  if (!childrenKey) {
    return [];
  }

  if (childrenKey === 'node') {
    const childNodeType = parent.getIn([childrenKey, 'type']);
    if (childNodeType === 'html-element' || childNodeType === 'react-component') {
      return [parent.getIn([childrenKey])]
    }

    return getFirstLevelConcreteChildren(parent.getIn([childrenKey]));
  }

  const children = parent.getIn([childrenKey]);
  const concreteNode = [];
  (children ||[]).forEach((child) => {
    const childNodeType = child.getIn(['type'])
    if (childNodeType === 'html-element' || childNodeType === 'react-component') {
      concreteNode.push(child)
      return;
    }

    concreteNode.push(...getFirstLevelConcreteChildren(child));
  });

  return concreteNode;
}
