import React from 'react';
import { APIInvokeProperty, APIResultProperty, CTX } from '../../../types';
import useInstantiateProps from '../../../use-instantiate-props';

type Props = {
  nodeProps: Record<string, APIInvokeProperty | APIResultProperty>;
  ctx: CTX
}

export default function Link({ nodeProps, ctx }: Props): JSX.Element {
  const { foo, bar, onFetch } = useInstantiateProps({ nodeProps, ctx });

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
