import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpenAPIV3 } from 'openapi-types';

import APIStream, { APIResult } from './api-stream';
import { RequestParams } from 'packages/request-builder/src';

type Convertor<T> = (result: APIResult) => T;

export class QueryResult {
  apiDoc: OpenAPIV3.Document;
  apiStream: APIStream;

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.apiDoc = apiDoc;
    this.apiStream = new APIStream(this.apiDoc, streamIDMap);
  }

  getValue<T>(streamID: string, convertor: Convertor<T>): Observable<T> {
    const [apiStream$] = this.apiStream.getStream(streamID);

    return apiStream$.pipe(map(convertor));
  }

  getAction(streamID: string, convertor: (params?: any) => RequestParams): (params: any) => void {
    const [, { next }] = this.apiStream.getStream(streamID);
    return (params: any) => {
      next(convertor(params));
    };
  }
}
