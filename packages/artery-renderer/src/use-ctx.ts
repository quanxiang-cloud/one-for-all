import React, { useContext } from 'react';
import { createBrowserHistory } from 'history';
import { BehaviorSubject } from 'rxjs';

import StatesHubAPI from './boot-up/states-hub-api';
import SharedStatesHub from './boot-up/states-hub-shared';
import NodePropsCache from './boot-up/node-props-cache';
import type { CTX } from './types';

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
  nodePropsCache: new NodePropsCache(new Set()),

  plugins: {},
};

export const CTXContext = React.createContext<CTX>(ctx);

export default function useCTX(): CTX {
  return useContext(CTXContext);
}
