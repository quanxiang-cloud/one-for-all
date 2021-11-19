import { CTX } from '../../..';
import APIStateHub from '../../api-state-hub';
import SharedStatesHub from '../../shared-states-hub';

const ctx: CTX = {
  apiStates: new APIStateHub({ build: () => ({ url: '', method: '' }) }, {}),
  sharedStates: new SharedStatesHub({}),
};

export default ctx;
