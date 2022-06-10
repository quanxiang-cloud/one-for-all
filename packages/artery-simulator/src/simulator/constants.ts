import { ContourNode } from '../types';

export const DND_DATA_TRANSFER_TYPE_NODE_ID = 'simulator_dragging_node_id';
export const DND_DATA_TRANSFER_TYPE_ARTERY_NODE = 'artery_node';

export const MESSAGE_TYPE_ARTERY = 'artery';
export const MESSAGE_TYPE_ACTIVE_NODE = 'active_node';
export const MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID = 'active_over_layer_node_id';
export const MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN = 'check_node_support_children';

export const DUMMY_ARTERY_ROOT_NODE_ID = 'dummy_artery_root_node_id';

export const FALLBACK_CONTOUR_NODE_ID = 'FALLBACK_CONTOUR_NODE_ID';
export const FALLBACK_CONTOUR: ContourNode = {
  id: FALLBACK_CONTOUR_NODE_ID,
  absolutePosition: { height: 0, width: 0, x: 0, y: 0 },
  relativeRect: { height: 0, width: 0, x: 0, y: 0 },
  raw: { height: 0, width: 0, x: 0, y: 0, bottom: 0, left: 0, right: 0, top: 0 } as DOMRectReadOnly,
  executor: '',
  depth: 0,
}
