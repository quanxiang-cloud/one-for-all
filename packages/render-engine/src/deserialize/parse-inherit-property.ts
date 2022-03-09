import SchemaSpec from 'packages/schema-spec/src';

export default function parseInheritProperty(
  node: SchemaSpec.SchemaNode,
  path: string,
  cacheIDs: Set<string>,
): Set<string> {
  const props = node.props || {};

  Object.entries(props).forEach(([key, property]) => {
    if (property.type !== 'inherited_property') {
      return;
    }
    const level = property.parentIndex;
    const parentIDs = path.split('/').reverse();
    if (Number.isNaN(level) || level > parentIDs.length) {
      return;
    }

    const parentID = parentIDs[level];
    cacheIDs.add(parentID);
  });

  if ('children' in node) {
    node.children?.forEach((subNode) => parseInheritProperty(subNode, `${path}/${node.id}`, cacheIDs));
  }

  if ('node' in node) {
    parseInheritProperty(node.node as SchemaSpec.SchemaNode, `${path}/${node.id}`, cacheIDs);
  }

  return cacheIDs;
}
