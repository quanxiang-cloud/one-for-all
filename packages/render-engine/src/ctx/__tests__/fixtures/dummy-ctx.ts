import { CTX } from '../../..';
import StatesHubAPI from '../../states-hub-api';
import SharedStatesHub from '../../states-hub-shared';
import NodePropsCache from '../../node-props-cache';

const ctx: CTX = {
  statesHubAPI: new StatesHubAPI({
    apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
    apiStateSpec: {},
  }),
  statesHubShared: new SharedStatesHub({}),

  apiStates: {},
  states: {},
  nodePropsCache: new NodePropsCache([]),
};

export default ctx;
