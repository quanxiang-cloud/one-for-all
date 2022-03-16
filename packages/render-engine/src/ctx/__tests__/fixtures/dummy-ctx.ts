import { BehaviorSubject } from 'rxjs';
import { CTX } from '../../..';
import StatesHubAPI from '../../states-hub-api';
import SharedStatesHub from '../../states-hub-shared';

const ctx: CTX = {
  statesHubAPI: new StatesHubAPI({
    apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
    apiStateSpec: {},
  }),
  statesHubShared: new SharedStatesHub({}),

  routeState$: new BehaviorSubject({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  }),

  apiStates: {},
  states: {},
  plugins: {},
};

export default ctx;
