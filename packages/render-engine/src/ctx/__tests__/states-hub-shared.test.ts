import { BehaviorSubject } from 'rxjs';
import { SharedStatesSpec } from '../../types';
import StatesHubShared from '../states-hub-shared';

describe('StatesHubShared_hasState$_return_expected_value', () => {
  test('simplest_situation', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);

    expect(statesHubShared.hasState$('foo')).toBe(true);
    expect(statesHubShared.hasState$('bar')).toBe(false);
  });

  test('defined_state_if_not_exist', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);

    statesHubShared.getState$('bar');

    expect(statesHubShared.hasState$('bar')).toBe(true);
  });

  test('return_false_even_if_parent_has_state', () => {
    const parentState: StatesHubShared = new StatesHubShared({
      someStateInParent: { initial: 'foo' },
    });
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec, parentState);

    expect(statesHubShared.hasState$('someStateInParent')).toBe(false);
  });
});

describe('StatesHubShared_getState$_return_expected_value', () => {
  test('return_expected_initial', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);

    const foo$ = statesHubShared.getState$('foo');
    const bar$ = statesHubShared.getState$('bar');

    expect(foo$).toBeInstanceOf(BehaviorSubject);
    expect(foo$.value).toBe('foo');
    expect(bar$).toBeInstanceOf(BehaviorSubject);
    expect(bar$.value).toBeUndefined();
  });

  test('return_parent_state$', () => {
    const parentState: StatesHubShared = new StatesHubShared({
      someStateInParent: { initial: 'some_parent_value' },
    });
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec, parentState);

    const someStateInParent$ = statesHubShared.getState$('someStateInParent');

    expect(someStateInParent$).toBeInstanceOf(BehaviorSubject);
    expect(someStateInParent$.value).toBe('some_parent_value');
  });
});

test('StatesHubShared_getNodeState$_return_initial_value', () => {
  const statesHubShared = new StatesHubShared({});
  const nodeState$ = statesHubShared.getNodeState$('some_not_existed_key');

  expect(nodeState$).toBeInstanceOf(BehaviorSubject);
  expect(nodeState$.value).toBeUndefined();
});

test('StatesHubShared_getNodeState$_return_expected_value', () => {
  const statesHubShared = new StatesHubShared({});
  const nodeKey = 'some_node_key';
  const nodeValue = 'some_node_value';
  statesHubShared.exposeNodeState(nodeKey, nodeValue);

  const nodeState$ = statesHubShared.getNodeState$(nodeKey);

  expect(nodeState$).toBeInstanceOf(BehaviorSubject);
  expect(nodeState$.value).toBe(nodeValue);
});

test('StatesHubShared_getNodeState$_return_parent_node_value', () => {
  const parentState: StatesHubShared = new StatesHubShared({});
  const parentNodeID = 'parentNodeId';
  const parentNodeValue = 'parentNodeValue';
  parentState.exposeNodeState(parentNodeID, parentNodeValue);

  const statesHubShared = new StatesHubShared({}, parentState);

  const nodeState$ = statesHubShared.getNodeState$(parentNodeID);

  expect(nodeState$).toBeInstanceOf(BehaviorSubject);
  expect(nodeState$.value).toBe(parentNodeValue);
});

// todo add test cases for
// retrieveNodeState: (nodeKey: string) => unknown;
// mutateState: (stateID: string, state: unknown) => void;
