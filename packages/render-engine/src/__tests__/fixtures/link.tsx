import React, { useEffect } from 'react';
import APIStateHub from '../../api-state-hub';
import { APIInvokeProperty, APIDerivedProperty, Instantiated, CTX } from '../../types';
import useConnection from '../../use-connection';

type Props = {
  nodeProps: Record<string, APIInvokeProperty<Instantiated> | APIDerivedProperty<Instantiated>>;
  ctx: CTX;
}

export default function Link({ nodeProps, ctx }: Props): JSX.Element {
  const { foo, bar, onFetch } = useConnection({ nodeProps, ctx });

  useEffect(() => {
    onFetch();
    // useEffect MUST have an empty dependance list,
    // otherwise test will never end
    // why???
    // https://github.com/testing-library/react-testing-library/issues/242
  }, []);

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
