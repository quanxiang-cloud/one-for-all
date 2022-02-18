import fs from 'fs';
import YAML from 'yaml';

import { Variables } from '../src/type';

const spec: { VARIABLES: Variables; TEST_CASES: Array<{ formula: string; result: any }> } = YAML.parse(
  fs.readFileSync('formula-spec/test-cases.yaml', 'utf8'),
);

const pairsExpectToMatch = spec.TEST_CASES.map((testCase) => {
  return {
    ...testCase,
    variables: spec.VARIABLES,
  };
});

type TestCase = {
  formula: string;
  result: boolean | number | string;
  variables: Variables;
};

const VARIABLES = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  one_str: '1',
  two_str: '2',
  three_str: '3',
  four_str: '4',
  five_str: '5',
  field_6Vwi1Eds: 20,
};

const invalidFormulas = [
  'ggg ∈ {rrrrr, 90 , 43, wew} && ggg ∈ {rrrrr, 90 , 43, wew}}}',
  'some_undefined_variable abd',
];

export { pairsExpectToMatch, invalidFormulas };
