import { exactlyCheck, prefixCheck } from '../use-match';

test('exactlyCheck_return_expected_value', () => {
  const cases: Array<[string, string, boolean]> = [
    ['/', '/', true],
    ['/abc/def', '/abc/def', true],
    ['/abc/defghi', '/abc/def', false],
    ['/abc/def', '/abc/defghi', false],
    ['/abc/def', '/abc/:id', true],
    ['/abc/def/', '/abc/:id', false],
    ['/abc/def', '/:id/def', true],
    ['/abc/def/', '/:id/def', false],
    ['/abc/def/ghi', '/:id/def', false],
    ['/abc/def', '/abc/def/ghi', false],
  ];

  cases.forEach(([path, currentRoutePath, result]) => {
    expect(exactlyCheck(path, currentRoutePath)).toBe(result);
  });
});

test('prefixCheck_return_expected_value', () => {
  const cases: Array<[string, string, boolean]> = [
    ['/', '/', true],
    ['/abc/def', '/abc/def', true],
    ['/abc/defghi', '/abc/def', false],
    ['/abc/def', '/abc/defghi', false],
    ['/abc/def', '/abc/:id', true],
    ['/abc/def/', '/abc/:id', true],
    ['/abc/def', '/:id/def', true],
    ['/abc/def/', '/:id/def', true],
    ['/abc/def/ghi', '/:id/def', true],
    ['/abc/def', '/abc/def/ghi', false],
    ['/def/abc/ghi', '/abc/def', false],
  ];

  cases.forEach(([path, currentRoutePath, result]) => {
    expect(prefixCheck(path, currentRoutePath)).toBe(result);
  });
});
