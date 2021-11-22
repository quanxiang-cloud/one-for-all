import { CTX } from '../../..';
import APIStatesHub from '../../states-hub-api';
import SharedStatesHub from '../../states-hub-shared';

const ctx: CTX = {
  statesHubAPI: new APIStatesHub({ build: () => ({ url: '', method: '' }) }, {}),
  statesHubShared: new SharedStatesHub({}),

  apiStates: {},
  states: {},
};

export default ctx;
