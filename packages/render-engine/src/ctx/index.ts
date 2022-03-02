import StatesHubAPI from './states-hub-api';
import StatesHubShared from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, Plugins, SharedStatesSpec } from '../types';
import type { APIStatesSpec, SharedStatesSpec as _SharedStatesSpec } from '@one-for-all/schema-spec';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import deserialize from '../deserialize';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: _SharedStatesSpec;
  parentCTX?: CTX;
  plugins?: Plugins;
}

function getAsyncStates(spec: SharedStatesSpec): Array<[string, () => unknown]> {
  return Object.entries(spec)
    .filter((pair): pair is [string, { initializer: () => unknown }] => {
      return !!pair[1].initializer;
    }).map<[string, () => unknown]>(([key, { initializer }]) => {
      // todo handle error
      return [key, initializer];
    });
}

function promisify(func: () => unknown): Promise<unknown> {
  return Promise.resolve(() => {
    try {
      return func();
    } catch (error) {
      return undefined;
    }
  });
}

async function resolveSharedStates(spec: SharedStatesSpec): Promise<SharedStatesSpec> {
  const asyncStatePairs = getAsyncStates(spec);
  const stateList = await Promise.all(asyncStatePairs.map(([, initializer]) => {
    return promisify(initializer);
  }));

  asyncStatePairs.forEach(([key], index) => {
    spec[key].initial = stateList[index] ?? spec[key].initial;
  });

  return spec;
}

async function initCTX({ apiStateSpec, sharedStatesSpec, parentCTX, plugins }: Params): Promise<CTX> {
  const { apiSpecAdapter, repository, refLoader } = plugins || {};

  const statesHubAPI = new StatesHubAPI(
    {
      apiSpecAdapter: apiSpecAdapter || dummyAPISpecAdapter,
      apiStateSpec: apiStateSpec || {},
    },
    parentCTX?.statesHubAPI,
  );

  const instantiateSpec = deserialize(sharedStatesSpec, null) as SharedStatesSpec;
  const initializedState = await resolveSharedStates(instantiateSpec || {});
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),

    repository: repository || parentCTX?.repository,
    refLoader: refLoader || parentCTX?.refLoader,
  };

  return ctx;
}

export default initCTX;
