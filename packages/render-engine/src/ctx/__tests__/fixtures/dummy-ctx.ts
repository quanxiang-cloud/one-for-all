import { CTX } from '../../..';
import APIStateHub from '../../api-state-hub';
import NodeStateHub from '../../node-state-hub';
import SharedStatesHub from '../../shared-states-hub';

const ctx: CTX = {
  apiStates: new APIStateHub({ build: () => ({ url: '', method: '' }) }, {}),
  sharedStates: new SharedStatesHub({}),
  nodeStates: new NodeStateHub(),
};

export default ctx;
