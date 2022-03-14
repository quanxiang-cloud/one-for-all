import { Seq } from 'immutable';
import parentIdPath from './raw/parentIdPath';

function getNodeParentIDs(schemaNode, nodeID) {
  const node = fromJS(schemaNode);

  const ids = parentIdPath(node, nodeID);

  return Seq.isSeq(ids) ? ids.toJS() : undefined;
}

export default getNodeParentIDs;
