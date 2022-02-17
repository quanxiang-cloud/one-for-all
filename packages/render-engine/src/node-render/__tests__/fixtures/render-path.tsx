import React, { PropsWithChildren, useContext } from 'react';
import { Repository } from '../../..';
import PathContext from '../../path-context';

type Props = PropsWithChildren<{
  id: string;
}>;

function RenderPath({ id, children }: Props): JSX.Element {
  const parentPath = useContext(PathContext);

  return (
    <div id={id} data-path={parentPath}>
      {children}
    </div>
  );
}

const repository: Repository = {
  'PathContextTest@whatever': { RenderPath },
};

export default repository;
