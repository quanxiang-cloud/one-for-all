export const DND_DATA_TRANSFER_TYPE_NODE_ID = 'simulator_dragging_node_id';
export const DND_DATA_TRANSFER_TYPE_ARTERY_NODE = 'artery_node';

export const MESSAGE_TYPE_ARTERY = 'artery';
export const MESSAGE_TYPE_ACTIVE_NODE = 'active_node';
export const MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID = 'active_over_layer_node_id';
export const MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN = 'check_node_support_children';

// a temporary patch for over layer components
// todo fixme
export const __OVER_LAYER_COMPONENTS: Array<{ packageName: string; exportName: string }> = [
  { packageName: '@one-for-all/headless-ui', exportName: 'MediocreDialog' },
];
