import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import { APIState } from './types';
import responseState$, { dummySendRequest, dummyStream$, StreamActions } from './state/state';

type ResultConvertor<T> = (result: APIState) => T;
type ActionParamsConvertor = (...args: any[]) => RequestParams;

export default class APIStream {
  requestBuilder: RequestBuilder;
  // map of streamID and operationID
  streamIDMap: Record<string, string>;
  streamCache: Record<string, [Observable<APIState>, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.requestBuilder = new RequestBuilder(apiDoc);
    this.streamIDMap = streamIDMap;
  }

  getValue<T>(streamID: string, convertor: ResultConvertor<T>): Observable<T> {
    const [apiStream$] = this.getStream(streamID);

    return apiStream$.pipe(map(convertor));
  }

  getAction(streamID: string, convertor?: ActionParamsConvertor): (...args: any[]) => void {
    const [, { next }] = this.getStream(streamID);

    return (...args: any[]) => {
      next(convertor?.(...args));
    };
  }

  getStream(streamID: string): [Observable<APIState>, StreamActions] {
    if (!this.streamIDMap[streamID]) {
      // todo log error message
      return [dummyStream$, dummySendRequest];
    }

    const key = `${streamID}:${this.streamIDMap[streamID]}`;
    if (!this.streamCache[key]) {
      const [apiState$, setParams] = responseState$(this.streamIDMap[streamID], this.requestBuilder);
      this.streamCache[key] = [apiState$, setParams];
    }

    return this.streamCache[key];
  }
}
