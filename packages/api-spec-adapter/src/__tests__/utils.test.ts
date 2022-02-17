import { join } from '../utils';

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
