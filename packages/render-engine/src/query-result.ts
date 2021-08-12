import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpenAPIV3 } from 'openapi-types';

import { RequestParams } from '@ofa/request-builder/src/types';

import APIStream from './api-stream';
import { APIResult } from './types';

type ResultConvertor<T> = (result: APIResult) => T;
type ActionParamsConvertor = (...args: any[]) => RequestParams;

export default class QueryResult {
  apiDoc: OpenAPIV3.Document;
  apiStream: APIStream;

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.apiDoc = apiDoc;
    this.apiStream = new APIStream(this.apiDoc, streamIDMap);
  }

  getValue<T>(streamID: string, convertor: ResultConvertor<T>): Observable<T> {
    const [apiStream$] = this.apiStream.getStream(streamID);

    return apiStream$.pipe(map(convertor));
  }

  getAction(streamID: string, convertor?: ActionParamsConvertor): (...args: any[]) => void {
    const [, { next }] = this.apiStream.getStream(streamID);

    return (...args: any[]) => {
      next(convertor?.(...args));
    };
  }
}
