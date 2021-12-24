import { logger } from '@ofa/utils';
import { renderHook } from '@testing-library/react-hooks/pure';

import APIStatesHub from '../../ctx/states-hub-api';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import { useIterable } from '../helpers';
import { Instantiated, PlainState, NodePropType } from '../..';

const dummyStatesHubAPI = new APIStatesHub(
  { build: () => ({ url: '', method: '' }) },
  { not_array_result: { apiID: 'not_array_result' } },
);

test('useIterable_should_return_null_if_state_is_not_iterable', () => {
  dummyCTX.statesHubAPI = dummyStatesHubAPI;
  dummyCTX.statesHubShared.mutateState('not_arr', {});
  dummyCTX.statesHubShared.exposeNodeState('not_arr_node', {});
  dummyCTX.statesHubAPI.getState$('not_array_result').next({ result: {}, loading: false, error: undefined });

  const iterableStates: Array<PlainState<Instantiated>> = [
    {
      type: NodePropType.SharedStateProperty,
      stateID: 'not_arr',
      fallback: [],
    },
    {
      type: NodePropType.NodeStateProperty,
      nodeKey: 'not_arr_node',
      fallback: [],
    },
    {
      type: NodePropType.APIResultProperty,
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
