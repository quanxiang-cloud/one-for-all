import { Selector } from '../types';
import { isSelectorInWhiteList } from '../utils';

const isSelectorInWhiteListTestCases: Array<{ selectorPath: string[]; whiteList?: Selector[]; result: boolean }> = [
  {
    selectorPath: [],
    result: true,
  },
  {
    selectorPath: ['.abc'],
    whiteList: [{ selector: '.abc'}],
    result: true,
  },
  {
    selectorPath: ['.abc'],
    whiteList: [{ selector: '.def'}],
    result: false,
  },
  {
    selectorPath: ['.abc', '.def'],
    whiteList: [{ selector: '.abc'}],
    result: false,
  },
  {
    selectorPath: ['.abc'],
    whiteList: [{ selector: '.abc'}, { selector: '.def'}],
    result: true,
  },
  {
    selectorPath: ['.abc', '.def'],
    whiteList: [{ selector: '.abc'}, { selector: '.def'}],
    result: false,
  },
  {
    selectorPath: ['.abc', '.def'],
    whiteList: [{ selector: '.abc', nestedSelector: [{ selector: '.def'}]}],
    result: true,
  },
];

test('isValidPath', () => {
  isSelectorInWhiteListTestCases.forEach(({ selectorPath, whiteList, result }) => {
    const r = isSelectorInWhiteList(selectorPath, whiteList);
    if (r !== result) {
      console.error(selectorPath, whiteList, result);
    }
    expect(r).toBe(result);
  });
});
