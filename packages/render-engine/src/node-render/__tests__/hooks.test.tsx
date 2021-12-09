import React from 'react';
import { renderHook } from '@testing-library/react-hooks/pure';
import { logger } from '@ofa/utils';

import { ReactComponentNode, Instantiated, Repository } from '../../types';
import { useLifecycleHook, useNodeComponent } from '../hooks';

jest.mock('../../repository');

test('useNodeComponent_should_return_null', async () => {
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'null',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { result, unmount } = renderHook(() => useNodeComponent(node));

  // await waitForNextUpdate();

  expect(result.current).toEqual(null);
  // expect(logger.error).toBeCalled();

  unmount();
});

test('useNodeComponent_should_return_dummy_component', async () => {
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { result, unmount, waitForNextUpdate } = renderHook(() => useNodeComponent(node));

  await waitForNextUpdate();

  expect(result.current).toBeTruthy();
  expect(logger.error).not.toBeCalled();

  unmount();
});

test('useNodeComponent_should_return_component_in_repository', () => {
  const dummyComponent = (): JSX.Element => (<div />);
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };
  const repository: Repository = {
    'foo@whatever': {
      Foo: dummyComponent,
    },
  };
  const { result, unmount } = renderHook(() => useNodeComponent(node, repository));

  expect(logger.error).not.toBeCalled();
  expect(result.current).toEqual(dummyComponent);

  unmount();
});

test('useLifecycleHook_should_be_called', () => {
  const didMount = jest.fn();
  const willUnmount = jest.fn();
  const { unmount } = renderHook(() => useLifecycleHook({ didMount, willUnmount }));

  unmount();

  expect(didMount).toBeCalled();
  expect(willUnmount).toBeCalled();
});
