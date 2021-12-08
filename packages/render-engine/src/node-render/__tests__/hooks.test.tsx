import React from 'react';
import { renderHook } from '@testing-library/react-hooks/pure';

import { ReactComponentNode, Instantiated, Repository } from '../../types';
import { useNodeComponent } from '../hooks';

jest.mock('../../repository');

// test('useNodeComponent_should_return_null', async () => {
//   const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
//     packageName: 'null',
//     packageVersion: 'whatever',
//     exportName: 'Foo',
//   };

//   // eslint-disable-next-line no-console
//   console.error = jest.fn();

//   const { result, unmount, waitForNextUpdate } = renderHook(() => useNodeComponent(node));

//   await waitForNextUpdate();

//   expect(result.current).toEqual(null);
//   // eslint-disable-next-line no-console
//   expect(console.error).toBeCalled();

//   unmount();
// });

test('useNodeComponent_should_return_dummy_component', async () => {
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  // eslint-disable-next-line no-console
  console.error = jest.fn(console.log);

  const { result, unmount, waitForNextUpdate } = renderHook(() => useNodeComponent(node));

  await waitForNextUpdate();

  expect(result.current).toBeTruthy();
  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();

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

  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();
  expect(result.current).toEqual(dummyComponent);

  unmount();
});
