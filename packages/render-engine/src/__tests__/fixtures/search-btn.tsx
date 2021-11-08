import React from 'react';
import { APIInvokeProperty, APIDerivedProperty, Instantiated, CTX } from '../../types';
import useConnection from '../../use-connection';

type Props = {
  nodeProps: Record<string, APIInvokeProperty<Instantiated> | APIDerivedProperty<Instantiated>>;
  ctx: CTX
}

export default function Link({ nodeProps, ctx }: Props): JSX.Element {
  const { foo, bar, onFetch } = useConnection({ nodeProps, ctx });

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
