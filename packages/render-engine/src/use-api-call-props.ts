import QueryResult from './use-query';
import { APICallProperty } from './types';

type Props = {
  props: Record<string, APICallProperty>;
  queryResult: QueryResult;
}

type APICallProps = Record<string, (...args: any[]) => void>;

// todo assign callback to ref?
export default function useAPICallProps({ props, queryResult }: Props): APICallProps {
  return Object.entries(props).reduce<APICallProps>((acc, [propsName, { streamID, convertor }]) => {
    acc[propsName] = queryResult.getAction(streamID, convertor);
    return acc;
  }, {});
}
