import QueryResult from './query-result';
import { APICallProperty } from './types';

type Props = {
  props: Record<string, APICallProperty>;
  queryResult: QueryResult;
}

type APICallProps = Record<string, (...args: any[]) => void>;

// todo assign callback to ref?
export default function useAPICallProps({ props, queryResult }: Props): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, { streamID, convertor }]) => {
      acc[propName] = queryResult.getAction(streamID, convertor);
      return acc;
    }, {});
}
