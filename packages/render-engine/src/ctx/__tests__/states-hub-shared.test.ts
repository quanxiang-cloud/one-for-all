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

  test('return_true_if_parent_has_state', () => {
    const parentState: StatesHubShared = new StatesHubShared({
      someStateInParent: { initial: 'foo' },
    });
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec, parentState);

    expect(statesHubShared.hasState$('someStateInParent')).toBe(true);
  });

  test('return_true_if_grand_parent_has_state', () => {
    const grandState: StatesHubShared = new StatesHubShared({ grandState: { initial: 'grandState' } });
    const parentState: StatesHubShared = new StatesHubShared({}, grandState);
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec, parentState);

    expect(statesHubShared.hasState$('grandState')).toBe(true);
  });

  test('return_true_after_get_state$_called', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);

    expect(statesHubShared.hasState$('bar')).toBe(false);

    statesHubShared.getState$('bar');

    expect(statesHubShared.hasState$('bar')).toBe(true);
  });
});

describe('StatesHubShared_getState$_return_expected_value', () => {
  test('getState$_always_return_truthy', () => {
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

  test('return_grand_parent_state', () => {
    const grandState: StatesHubShared = new StatesHubShared({ grandState: { initial: 'grandState' } });
    const parentState: StatesHubShared = new StatesHubShared({}, grandState);
    const statesHubShared = new StatesHubShared({}, parentState);

    const someStateInParent$ = statesHubShared.getState$('grandState');

    expect(someStateInParent$).toBeInstanceOf(BehaviorSubject);
    expect(someStateInParent$.value).toBe('grandState');
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

describe('StatesHubShared_mutateState_return_expected_value', () => {
  test('StatesHubShared_writeable_undefined_return_expected_value', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo' },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);
    const foo$ = statesHubShared.getState$('foo');

    expect(foo$).toBeInstanceOf(BehaviorSubject);
    expect(foo$.value).toBe('foo');
    statesHubShared.mutateState('foo', 'kk_mei');
    expect(foo$.value).toBe('kk_mei');
  });

  test('StatesHubShared_writeable_true_return_expected_value', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo', writeable: true },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);
    const foo$ = statesHubShared.getState$('foo');

    expect(foo$).toBeInstanceOf(BehaviorSubject);
    expect(foo$.value).toBe('foo');
    statesHubShared.mutateState('foo', 'kk_mei');
    expect(foo$.value).toBe('kk_mei');
  });

  test('StatesHubShared_writeable_false_return_expected_value', () => {
    const sharedStatesSpec: SharedStatesSpec = {
      foo: { initial: 'foo', writeable: false },
    };
    const statesHubShared = new StatesHubShared(sharedStatesSpec);
    const foo$ = statesHubShared.getState$('foo');

    expect(foo$).toBeInstanceOf(BehaviorSubject);
    expect(foo$.value).toBe('foo');
    statesHubShared.mutateState('foo', 'kk_mei');
    expect(foo$.value).toBe('foo');
  });
});

// todo add test cases for
// retrieveNodeState: (nodeKey: string) => unknown;
// mutateState: (stateID: string, state: unknown) => void;
