import { logger } from '@ofa/utils';
import { renderHook } from '@testing-library/react-hooks/pure';

import StatesHubAPI from '../../ctx/states-hub-api';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import { useIterable } from '../helpers';
import { PlainState } from '../../types';

const dummyStatesHubAPI = new StatesHubAPI({
  apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
  apiStateSpec: { not_array_result: { apiID: 'not_array_result' } },
});

test('useIterable_should_return_null_if_state_is_not_iterable', () => {
  dummyCTX.statesHubAPI = dummyStatesHubAPI;
  dummyCTX.statesHubShared.mutateState('not_arr', {});
  dummyCTX.statesHubShared.exposeNodeState('not_arr_node', {});
  dummyCTX.statesHubAPI.getState$('not_array_result').next({ result: {}, loading: false, error: undefined });

  const iterableStates: Array<PlainState> = [
    {
      type: 'shared_state_property',
      stateID: 'not_arr',
      fallback: [],
    },
    {
      type: 'node_state_property',
      nodeKey: 'not_arr_node',
      fallback: [],
    },
    {
      type: 'api_result_property',
      stateID: 'not_array_result',
      fallback: [],
    },
  ];

  for (const iterableState of iterableStates) {
    const { result, unmount } = renderHook(() => useIterable(iterableState, dummyCTX));
    expect(result.current).toBeNull();
    unmount();
  }

  expect(logger.error).toBeCalledTimes(3);
});
