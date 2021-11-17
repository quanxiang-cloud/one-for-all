import { OpenAPIV3 } from 'openapi-types';
import { CTX } from '../../..';
import APIStateHub from '../../api-state-hub';
import NodeStateHub from '../../node-state-hub';
import SharedStatesHub from '../../shared-states-hub';

const apiDoc: OpenAPIV3.Document = {
  openapi: '3.0.2',
  info: { title: 'some thing', version: '1.0.0' },
  paths: {},
};

const ctx: CTX = {
  apiStates: new APIStateHub(apiDoc, {}),
  sharedStates: new SharedStatesHub({}),
  nodeStates: new NodeStateHub(),
};

export default ctx;
