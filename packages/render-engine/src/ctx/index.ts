import StatesHubAPI from './states-hub-api';
import StatesHubShared from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, Plugins, SchemaNode, SharedStatesSpec } from '../types';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import deserialize from './deserialize';
import initializeLazyStates from './initialize-lazy-shared-states';
import SchemaSpec from '@one-for-all/schema-spec';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  schema: SchemaSpec.Schema;
  parentCTX?: CTX;
  plugins?: Plugins;
}

async function initCTX({ schema, parentCTX, plugins }: Params): Promise<{ ctx: CTX; rootNode: SchemaNode; }> {
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

  const instantiateSpec = deserialize(sharedStatesSpec, null) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(
    instantiateSpec || {},
    apiStateSpec || {},
    apiSpecAdapter,
  );
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),
    plugins: {
      repository: repository || parentCTX?.plugins?.repository,
      refLoader: refLoader || parentCTX?.plugins?.refLoader,
      componentLoader: componentLoader || parentCTX?.plugins?.componentLoader
    }
  };

  // todo handle error
  const rootNode = deserialize(schema.node, ctx) as SchemaNode;

  return { ctx, rootNode };
}

export default initCTX;
