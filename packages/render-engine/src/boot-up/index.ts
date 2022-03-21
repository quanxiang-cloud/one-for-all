import { createBrowserHistory } from 'history';
import { BehaviorSubject } from 'rxjs';
import SchemaSpec from '@one-for-all/schema-spec';

import getAPIStates from './api-states';
import deserialize from './deserialize';
import StatesHubAPI from './states-hub-api';
import getSharedStates from './shared-states';
import StatesHubShared from './states-hub-shared';
import initializeLazyStates from './initialize-lazy-shared-states';
import type { CTX, Plugins, SchemaNode, SharedStatesSpec } from '../types';
import parseInheritProperty from './deserialize/parse-inherit-property';
import NodePropsCache from './node-props-cache';

export interface BootUpParams {
  schema: SchemaSpec.Schema;
  parentCTX?: CTX;
  plugins?: Plugins;
}

export interface BootResult {
  ctx: CTX;
  rootNode: SchemaNode;
}

async function bootUp({ schema, parentCTX, plugins }: BootUpParams): Promise<BootResult> {
  const { apiStateSpec, sharedStatesSpec } = schema;
  const _plugins = Object.assign({}, parentCTX?.plugins || {}, plugins || {});

  const statesHubAPI = new StatesHubAPI({
    // TODO: throw error instead of tolerating it
    apiSpecAdapter: _plugins.apiSpecAdapter,
    apiStateSpec: apiStateSpec || {},
    parentHub: parentCTX?.statesHubAPI,
  });

  const instantiateSpec = deserialize(sharedStatesSpec || {}, undefined) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(
    instantiateSpec || {},
    apiStateSpec || {},
    _plugins.apiSpecAdapter,
  );
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const history = parentCTX?.history || createBrowserHistory();
  const location$ = parentCTX?.location$ || new BehaviorSubject(history.location);

  if (!parentCTX?.location$) {
    history.listen(({ location }) => {
      location$.next(location);
    });
  }

  const cacheIDs = parseInheritProperty(schema.node, 'ROOT', new Set());
  const nodePropsCache = new NodePropsCache(cacheIDs);

  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),
    history,
    location$,
    nodePropsCache,

    plugins: _plugins,
  };

  const rootNode = deserialize(schema.node, {
    apiStates: ctx.apiStates,
    states: ctx.states,
    history: ctx.history,
  }) as SchemaNode;
  if (!rootNode) {
    return Promise.reject(new Error('failed to init ctx!'));
  }

  return { ctx, rootNode };
}

export default bootUp;
