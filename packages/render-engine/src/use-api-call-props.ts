import APIStream from './api-stream';
import { APICallProperty } from './types';

type Props = {
  props: Record<string, APICallProperty>;
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
