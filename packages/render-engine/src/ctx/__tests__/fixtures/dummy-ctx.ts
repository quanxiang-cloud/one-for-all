import { createBrowserHistory } from 'history';
import { BehaviorSubject } from 'rxjs';

import { CTX } from '../../..';
import StatesHubAPI from '../../states-hub-api';
import SharedStatesHub from '../../states-hub-shared';

const history = createBrowserHistory();

const ctx: CTX = {
  statesHubAPI: new StatesHubAPI({
    apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
    apiStateSpec: {},
  }),
  statesHubShared: new SharedStatesHub({}),
  apiStates: {},
  states: {},
  history,
  location$: new BehaviorSubject(history.location),

  plugins: {},
};

export default ctx;
