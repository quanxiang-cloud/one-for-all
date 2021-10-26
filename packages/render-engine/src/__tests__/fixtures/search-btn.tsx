import React from 'react';
import StateHub from '../../state-hub';
import { APIInvokeProperty, APIDerivedProperty, Instantiated } from '../../types';
import useConnection from '../../use-connection';

type Props = {
  nodeProps: Record<string, APIInvokeProperty<Instantiated> | APIDerivedProperty<Instantiated>>;
  stateHub: StateHub;
}

export default function Link({ nodeProps, stateHub }: Props): JSX.Element {
  const { foo, bar, onFetch } = useConnection({ nodeProps, stateHub });

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
