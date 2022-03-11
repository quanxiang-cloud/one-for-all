import mockXHR from 'xhr-mock';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type * as SchemaSpec from '@one-for-all/schema-spec';
import { APIStatesSpec } from '../../types';
import initCTX from '../index';

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const apiStateSpec: APIStatesSpec = {
  some_api_state: { apiID: 'some_api_id' },
};

const sharedStatesSpec: SchemaSpec.SharedStatesSpec = {
  foo: { initial: 'foo' },
  lazyState: {
    initial: 'bar',
    initializer: {
      func: {
        type: 'initializer_func_spec',
        args: 'dependencies',
        body: 'return Promise.resolve(dependencies.some_api_state)',
      },
      dependencies: {
        some_api_state: {},
      },
    },
  },
};

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('initCTX_return_expected_value', async () => {
  const mockRes = 'mock_res';
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const schema: SchemaSpec.Schema = {
    apiStateSpec, sharedStatesSpec,
    node: { id: 'abv', type: 'html-element', name: 'div' },
  };

  const { ctx } = await initCTX({ schema, plugins: { apiSpecAdapter } });
  expect(ctx.states.lazyState).toBe(mockRes);
});
