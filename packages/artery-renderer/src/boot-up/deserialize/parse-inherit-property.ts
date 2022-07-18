import ArterySpec from '@one-for-all/artery';

export default function parseInheritProperty(node: ArterySpec.Node, cacheIDs: Set<string>): Set<string> {
  const props = node.props || {};

  Object.values(props).forEach((property) => {
    if (property.type !== 'inherited_property') {
      return;
    }

    if (!property.parentID) {
      return;
    }

    cacheIDs.add(property.parentID);
  });

  if ('children' in node) {
    node.children?.forEach((subNode) => parseInheritProperty(subNode, cacheIDs));
  }

  if ('node' in node) {
    parseInheritProperty(node.node as ArterySpec.Node, cacheIDs);
  }

  return cacheIDs;
}
