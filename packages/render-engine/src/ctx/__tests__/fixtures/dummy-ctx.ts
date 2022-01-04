import { CTX } from '../../..';
import StatesHubAPI from '../../states-hub-api';
import SharedStatesHub from '../../states-hub-shared';

const ctx: CTX = {
  statesHubAPI: new StatesHubAPI({ build: () => ({ url: '', method: '' }) }, {}),
  statesHubShared: new SharedStatesHub({}),

  apiStates: {},
  states: {},
};

export default ctx;
