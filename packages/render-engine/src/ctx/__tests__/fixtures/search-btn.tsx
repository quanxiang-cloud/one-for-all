import React from 'react';
import { APIInvokeProperty, APIDerivedProperty, Instantiated, CTX } from '../../../types';
import useInstantiateProps from '../../../use-instantiate-props';

type Props = {
  nodeProps: Record<string, APIInvokeProperty<Instantiated> | APIDerivedProperty<Instantiated>>;
  ctx: CTX
}

export default function Link({ nodeProps, ctx }: Props): JSX.Element {
  const { foo, bar, onFetch } = useInstantiateProps({ nodeProps, ctx });

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
