import getNodeParentIDs from './getNodeParentIDs';
import findNodeByID from './findNodeByID';

function getNodeParents(schemaNode, id) {
  const parentIDs = getNodeParentIDs(schemaNode, id);
  if (!parentIDs) {
    return;
  }

  return parentIDs.map((parentID) => findNodeByID(schemaNode, parentID));
}

export default getNodeParents;
