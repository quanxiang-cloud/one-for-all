import { join, toKeyPathPair } from '../utils';

const cases: Array<{ segments: string[]; result: string }> = [
  {
    segments: ['', 'abc'],
    result: '/abc',
  },
  {
    segments: ['', 'abc', '', 'def'],
    result: '/abc/def',
  },
  {
    segments: ['abc', 'def'],
    result: '/abc/def',
  },
  {
    segments: ['/abc', '/def'],
    result: '/abc/def',
  },
  {
    segments: ['/abc', 'def'],
    result: '/abc/def',
  },
  {
    segments: ['/abc', '/def/ghi'],
    result: '/abc/def/ghi',
  },
  {
    segments: ['/abc', '/def/ghi/'],
    result: '/abc/def/ghi',
  },
];

test('join_should_return_expected_value', () => {
  cases.forEach(({ segments, result }) => {
    expect(join(...segments)).toBe(result);
  });
});

test('toKeyPathPair_return_expected_value', () => {
  const arr = ['stop', 'running', 'creating'];
  expect(toKeyPathPair(arr, 'arr')).toMatchInlineSnapshot(`
    Array [
      Array [
        "arr.0",
        "stop",
      ],
      Array [
        "arr.1",
        "running",
      ],
      Array [
        "arr.2",
        "creating",
      ],
    ]
  `);

  const obj = { foo: { bar: { baz: 123, bzz: 'sss' } }, tom: 'jerry' };
  expect(toKeyPathPair(obj, 'obj')).toMatchInlineSnapshot(`
    Array [
      Array [
        "obj.foo.bar.baz",
        123,
      ],
      Array [
        "obj.foo.bar.bzz",
        "sss",
      ],
      Array [
        "obj.tom",
        "jerry",
      ],
    ]
  `);
});
