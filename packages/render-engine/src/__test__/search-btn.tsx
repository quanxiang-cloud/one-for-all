import React from 'react';
import StateHub from '../state-hub';
import { APIInvokeProperty, APIDerivedProperty } from '../types';
import useAPIState from '../use-api-state';

type Props = {
  props: Record<string, APIInvokeProperty | APIDerivedProperty>;
  stateHub: StateHub;
}

export default function Link({ props, stateHub }: Props): JSX.Element {
  const { foo, bar, onFetch } = useAPIState({ props, stateHub });

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
