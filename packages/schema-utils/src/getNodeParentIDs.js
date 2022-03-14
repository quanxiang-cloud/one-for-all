import { Seq } from 'immutable';
import parentIdPath from './raw/parentIdPath';

export function getNodeParentIDs(schemaNode, nodeID) {
  const node = fromJS(schemaNode);

  const ids = parentIdPath(node, nodeID);

  return Seq.isSeq(ids) ? ids.toJS() : undefined;
}
