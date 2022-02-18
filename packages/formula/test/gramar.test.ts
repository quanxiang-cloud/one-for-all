import { pairsExpectToMatch, invalidFormulas } from './test-cases';
import { parse, resolve } from '../src';

test('expect AST shape match', () => {
  pairsExpectToMatch.forEach(({ formula }) => {
    expect(parse(formula)).toMatchSnapshot();
  });
});

test('expect correct formula result', () => {
  pairsExpectToMatch.forEach(({ formula, result, variables }) => {
    const resolvedResult = resolve(parse(formula), variables);
    if (resolvedResult !== result) {
      console.log({ formula, result, variables });
      expect(resolvedResult).toBe(result);
    }
  });
});

test('expect throw on invalid formula', () => {
  invalidFormulas.forEach((formula) => {
    expect(() => parse(formula)).toThrow();
  });
});
