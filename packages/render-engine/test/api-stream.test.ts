import RequestBuilder from '@ofa/request-builder';
import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getQueryResultStream from '../src/api-stream';

const builder = new RequestBuilder(petStoreSpec as any);

test('api stream resolve value', (done) => {
  const [apiStream$] = getQueryResultStream('addTodo', builder);
  apiStream$.subscribe((response) => {
    expect(response).toBeTruthy();
    done();
  })
})
