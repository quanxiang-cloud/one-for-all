import { Seq, fromJS } from 'immutable';
import parentIdsSeq from './raw/parentIdsSeq';

function getNodeParentIDs(schemaNode, nodeID) {
  const node = fromJS(schemaNode);

  const ids = parentIdsSeq(node, nodeID);

  return Seq.isSeq(ids) ? ids.toJS() : undefined;
}

export default getNodeParentIDs;
