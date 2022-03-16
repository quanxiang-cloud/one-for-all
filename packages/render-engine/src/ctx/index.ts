import { createBrowserHistory } from 'history';
import { BehaviorSubject, combineLatestWith, of, tap } from 'rxjs';
import SchemaSpec from '@one-for-all/schema-spec';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { APIStatesSpec, SharedStatesSpec as _SharedStatesSpec } from '@one-for-all/schema-spec';

import getAPIStates from './api-states';
import deserialize from './deserialize';
import StatesHubAPI from './states-hub-api';
import getSharedStates from './shared-states';
import StatesHubShared from './states-hub-shared';
import initializeLazyStates from './initialize-lazy-shared-states';
import type { CTX, Plugins, SchemaNode, SharedStatesSpec, Location } from '../types';
import { useEffect } from 'react';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  schema: SchemaSpec.Schema;
  parentCTX?: CTX;
  plugins?: Plugins;
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: _SharedStatesSpec;
}

export interface UseCTXResult {
  ctx: CTX;
  rootNode: SchemaNode;
}

async function initCTX({ schema, parentCTX, plugins }: Params): Promise<UseCTXResult> {
  const history = createBrowserHistory({ window });
  const routeState$ = new BehaviorSubject(history.location as Location);

  const { apiStateSpec, sharedStatesSpec } = schema;
  const { apiSpecAdapter, repository, refLoader, componentLoader } = plugins || {};

  const statesHubAPI = new StatesHubAPI(
    {
      // TODO: throw error instead of tolerating it
      apiSpecAdapter: apiSpecAdapter || dummyAPISpecAdapter,
      apiStateSpec: apiStateSpec || {},
    },
    parentCTX?.statesHubAPI,
  );

  // add route full path and listen routeState
  const instantiateSpec = deserialize(sharedStatesSpec, null) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(
    instantiateSpec || {},
    apiStateSpec || {},
    apiSpecAdapter,
  );
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const ctx: CTX =  {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),

    goTo: history.push,
    goBack: history.back,
    historyListener: history.listen,
    routeState$,
    
    plugins: {
      repository: repository || parentCTX?.plugins?.repository,
      refLoader: refLoader || parentCTX?.plugins?.refLoader,
      componentLoader: componentLoader || parentCTX?.plugins?.componentLoader
    }
  };

  history.listen(({location}) => {routeState$.next(location);});

  // todo handle error
  const rootNode = deserialize(schema.node, ctx) as SchemaNode;

  return { ctx, rootNode };
}

export default initCTX;
