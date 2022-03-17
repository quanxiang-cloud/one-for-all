import { createBrowserHistory } from 'history';
import { BehaviorSubject } from 'rxjs';
import SchemaSpec from '@one-for-all/schema-spec';

import getAPIStates from './api-states';
import deserialize from './deserialize';
import StatesHubAPI from './states-hub-api';
import getSharedStates from './shared-states';
import StatesHubShared from './states-hub-shared';
import initializeLazyStates from './initialize-lazy-shared-states';
import type { CTX, Plugins, SchemaNode, SharedStatesSpec, HistoryState } from '../types';

interface Params {
  schema: SchemaSpec.Schema;
  parentCTX?: CTX;
  plugins?: Plugins;
}

function createHistoryState(): HistoryState {
  const history = createBrowserHistory();

  return {
    history,
    location$: new BehaviorSubject(history.location),
  };
}

async function initCTX({ schema, parentCTX, plugins }: Params): Promise<{ ctx: CTX; rootNode: SchemaNode }> {
  const { apiStateSpec, sharedStatesSpec } = schema;
  const { apiSpecAdapter, repository, refLoader, componentLoader } = plugins || {};

  const statesHubAPI = new StatesHubAPI(
    {
      // TODO: throw error instead of tolerating it
      apiSpecAdapter: apiSpecAdapter,
      apiStateSpec: apiStateSpec || {},
    },
    parentCTX?.statesHubAPI,
  );

  const instantiateSpec = deserialize(sharedStatesSpec || {}, null) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(
    instantiateSpec || {},
    apiStateSpec || {},
    apiSpecAdapter,
  );
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const historyState = parentCTX?.historyState || createHistoryState();

  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),
    historyState,

    plugins: {
      repository: repository || parentCTX?.plugins?.repository,
      refLoader: refLoader || parentCTX?.plugins?.refLoader,
      componentLoader: componentLoader || parentCTX?.plugins?.componentLoader,
    },
  };

  // todo handle error
  const rootNode = deserialize(schema.node, ctx) as SchemaNode;

  return { ctx, rootNode };
}

export default initCTX;
