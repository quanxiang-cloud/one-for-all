import { FormingRule } from '../../types';
import getSelectorsWhitelist from '../get-selectors-whitelist';

test('selectorsPath', () => {
  const formingRules: FormingRule[] = [
    {
      selector: '.foo',
      nested: [
        {
          selector: '.bar'
        },
        {
          selector: '.baz'
        }
      ]
    },
    {
      selector: '.button'
    }
  ];

  const pathSet = getSelectorsWhitelist(formingRules, new Set<string>(), '');

  expect(Array.from(pathSet)).toMatchSnapshot();
});
