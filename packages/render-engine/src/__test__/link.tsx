import React, { useEffect } from 'react';
import StateHub from '../state-hub';
import { APIInvokeProperty, APIDerivedProperty, Instantiated } from '../types';
import useConnection from '../use-connection';

type Props = {
  props: Record<string, APIInvokeProperty<Instantiated> | APIDerivedProperty<Instantiated>>;
  stateHub: StateHub;
}

export default function Link({ props, stateHub }: Props): JSX.Element {
  const { foo, bar, onFetch } = useConnection({ props, stateHub });

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
