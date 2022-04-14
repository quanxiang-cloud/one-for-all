jest.mock('../utils/to-formatted-scss');

import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { plugins, processOptions } from '../constant';
import formingAST from '../forming-ast';
import { FormingRule } from '../types';

test('formingAST', async () => {
  const scssStr = fs.readFileSync(path.join(__dirname, 'fixtures/index.scss'), { encoding: 'utf-8'});
  const { root } = await postcss(plugins).process(scssStr, processOptions);
  const formingRules: FormingRule[] = [
    {
      selector: '.parent',
      nested: [
        { selector: '.children' },
        { selector: '.missing-selector' }
      ]
    }
  ];
  const formatted = await formingAST(root.toJSON(), formingRules);
  expect(formatted).toMatchSnapshot();
});
