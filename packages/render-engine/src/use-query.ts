import { OpenAPIV3 } from 'openapi-types';

import APIStream from './api-stream';

export class QueryResult {
  apiDoc: OpenAPIV3.Document;
  apiStream: APIStream;

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.apiDoc = apiDoc;
    this.apiStream = new APIStream(this.apiDoc, streamIDMap);
  }
}
