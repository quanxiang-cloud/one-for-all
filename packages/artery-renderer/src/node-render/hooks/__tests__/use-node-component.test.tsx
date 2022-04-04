jest.mock('../helper');

import React from 'react';
import { logger } from '@one-for-all/utils';
import { renderHook } from '@testing-library/react-hooks/pure';

import { ReactComponentNode, Repository } from '../../../types';
import useNodeComponent from '../use-node-component';

function wait(timeSecond: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, timeSecond * 1000);
  });
}

test('useNodeComponent_should_return_dummy_component', async () => {
  const node: Pick<ReactComponentNode, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { result, unmount, waitForNextUpdate } = renderHook(() => useNodeComponent(node, {}));

  await waitForNextUpdate();

  expect(result.current).toBeTruthy();
  expect(logger.error).not.toBeCalled();

  unmount();
});

test('useNodeComponent_should_return_component_in_repository', () => {
  const dummyComponent = (): JSX.Element => <div />;
  const node: Pick<ReactComponentNode, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };
  const repository: Repository = {
    'foo@whatever': {
      Foo: dummyComponent,
    },
  };
  const { result, unmount } = renderHook(() => useNodeComponent(node, { repository }));

  expect(logger.error).not.toBeCalled();
  expect(result.current).toBeTruthy();

  unmount();
});
