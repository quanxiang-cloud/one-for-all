import getQueryResultStream from '../src/api-stream';

test('api stream resolve value', (done) => {
  const [apiStream$] = getQueryResultStream('addTodo');
  apiStream$.subscribe((response) => {
    expect(response).toBeTruthy();
    done();
  })
})
