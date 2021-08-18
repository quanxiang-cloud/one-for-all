import StateHub from './state-hub';
import { APIInvokeProperty } from './types';

type Props = {
  props: Record<string, APIInvokeProperty>;
  stateHub: StateHub;
}

type APICallProps = Record<string, (...args: any[]) => void>;

export default function useAPICallProps({ props, stateHub }: Props): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, { stateID, convertor }]) => {
      acc[propName] = stateHub.getAction(stateID, convertor);
      return acc;
    }, {});
}
