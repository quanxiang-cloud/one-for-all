import { useFlattenNodes } from '../utils';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import rootNode from './fixtures/node';
import { ImmutableNode, KeyPath } from '@one-for-all/artery-utils';

function toReadableString(pairs: Array<[KeyPath, ImmutableNode]>): string[] {
  return pairs.map(([keyPath, node]) => `${keyPath.toJS().join('/')}:${node.getIn(['id'])}`);
}

test('useFlattenNodes_should_return_all_nodes', () => {
  const { unmount, result } = renderHook(() => useFlattenNodes(rootNode, []));

  expect(toReadableString(result.current)).toMatchSnapshot();
  unmount();
});

describe('useFlattenNodes_should_filter_collapsed_node_children', () => {
  test('filter_first_level_nodes', () => {
    const { unmount, result } = renderHook(() => useFlattenNodes(rootNode, ['container']));

    expect(toReadableString(result.current)).toMatchSnapshot();
    unmount();
  });

  test('filter_children_of_todo-input-container', () => {
    const { unmount, result } = renderHook(() => useFlattenNodes(rootNode, ['todo-input-container']));

    expect(toReadableString(result.current)).toMatchSnapshot();
    unmount();
  });

  test('filter_children_of_todo-list-loop-composedNode', () => {
    const { unmount, result } = renderHook(() => useFlattenNodes(rootNode, ['todo-list-loop-composedNode']));

    expect(toReadableString(result.current)).toMatchSnapshot();
    unmount();
  });

  test('filter_children_of_active_node_todo-list-loop-composedNode', () => {
    const { unmount, result } = renderHook(() =>
      useFlattenNodes(rootNode, [], 'todo-list-loop-composedNode'),
    );

    expect(toReadableString(result.current)).toMatchSnapshot();
    unmount();
  });
});
