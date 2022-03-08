import SchemaSpec from 'packages/schema-spec/src';
import { CTX } from '../types';

export default function parseInheritProperty(
  node: SchemaSpec.SchemaNode,
  parentIDs: (string | number)[],
  ctx: unknown,
): SchemaSpec.SchemaNode {
  const props = node.props || {};

  Object.entries(props).forEach(([key, property]) => {
    if (property.type !== 'inherit_property') {
      return;
    }
    const level = property.parentIndex;

    if (Number.isNaN(level) || level > parentIDs.length) {
      return;
    }

    const parentID = parentIDs[level];
    (ctx as CTX)?.nodePropsCache?.addCacheKey(`${parentID}.${key}`);
  });

  if ('children' in node) {
    node.children = node.children?.map((subNode) => {
      return parseInheritProperty(subNode, [node.id, ...parentIDs], ctx);
    });
  }

  if ('node' in node) {
    node.node = parseInheritProperty(node.node as SchemaSpec.SchemaNode, [node.id, ...parentIDs], ctx);
  }

  return node;
}
