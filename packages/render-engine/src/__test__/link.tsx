import React, { useEffect } from 'react';
import StateHub from '../state-hub';
import { APIInvokeProperty, APIDerivedProperty } from '../types';
import useAPIState from '../use-api-state';

type Props = {
  props: Record<string, APIInvokeProperty | APIDerivedProperty>;
  stateHub: StateHub;
}

export default function Link({ props, stateHub }: Props): JSX.Element {
  const { foo, bar, onFetch } = useAPIState({ props, stateHub });

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
