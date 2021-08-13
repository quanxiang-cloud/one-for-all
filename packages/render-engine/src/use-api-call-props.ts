import APIStream from './api-stream';
import { APIInvokeProperty } from './types';

type Props = {
  props: Record<string, APIInvokeProperty>;
  apiStream: APIStream;
}

type APICallProps = Record<string, (...args: any[]) => void>;

export default function useAPICallProps({ props, apiStream }: Props): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, { streamID, convertor }]) => {
      acc[propName] = apiStream.getAction(streamID, convertor);
      return acc;
    }, {});
}
