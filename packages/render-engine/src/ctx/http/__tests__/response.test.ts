import mockXHR, { sequence } from 'xhr-mock';
import { Observable, Subject } from 'rxjs';

// import petStoreSpec from '../../spec-interpreter/__tests__/fixtures/petstore-spec';
// import SpecInterpreter from '../../spec-interpreter';
import getResponseState$ from '../response';
import { AjaxConfig } from 'rxjs/ajax';

// const specInterpreter = new SpecInterpreter(petStoreSpec);

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

function wait(timeSecond: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, timeSecond * 1000);
  });
}

test('response_return_initial_state', (done) => {
  const response$ = getResponseState$(new Observable<AjaxConfig>());

  response$.subscribe(({ data, loading, error }) => {
    try {
      expect(data).toBeUndefined();
      expect(error).toBeUndefined();
      expect(loading).toBe(false);
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('response_state_table', () => {
  test('loading_state_should_be_expected', async () => {
    const mockRes = { data: { id: 'abc-123' } };
    mockXHR.get(/.*/, (req, res) => {
      return res.status(200).body(JSON.stringify(mockRes));
    });

    const request$ = new Subject<AjaxConfig>();
    const response$ = getResponseState$(request$);
    const loadings: Array<boolean> = [];

    response$.subscribe(({ loading }) => loadings.push(loading));

    request$.next({ url: '/api/foo', method: 'get' });
    await wait(1);

    request$.next({ url: '/api/foo', method: 'get' });
    await wait(1);

    expect(loadings).toEqual([false, true, false, true, false]);
  });

  test('data_and_error_state_should_be_expected', async () => {
    const mockRes = { data: { id: 'abc-123' } };
    mockXHR.get(/.*/, sequence([
      { status: 404, body: JSON.stringify(mockRes) },
      { status: 200, body: JSON.stringify(mockRes) },
      { status: 404, body: JSON.stringify(mockRes) },
    ]));

    const request$ = new Subject<AjaxConfig>();
    const response$ = getResponseState$(request$);
    const dataList: Array<any> = [];
    const errorList: Array<any> = [];

    response$.subscribe(({ data, error }) => {
      dataList.push(data);
      errorList.push(error);
    });

    request$.next({ url: '/api/foo', method: 'get' });
    await wait(1);

    request$.next({ url: '/api/foo', method: 'get' });
    await wait(1);

    request$.next({ url: '/api/foo', method: 'get' });
    await wait(1);

    expect(dataList).toEqual([
      undefined, undefined, undefined, undefined, mockRes, mockRes, undefined,
    ]);
    expect(errorList).toMatchObject([undefined, undefined, {}, {}, undefined, undefined, {}]);
  });
});
