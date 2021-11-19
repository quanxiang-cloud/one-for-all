import { CTX } from '../../..';
import APIStatesHub from '../../api-states-hub';
import SharedStatesHub from '../../shared-states-hub';

const ctx: CTX = {
  apiStates: new APIStatesHub({ build: () => ({ url: '', method: '' }) }, {}),
  sharedStates: new SharedStatesHub({}),
};

export default ctx;
