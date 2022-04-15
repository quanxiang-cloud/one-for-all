jest.mock('../utils/to-formatted-scss');

import fs from 'fs';
import path from 'path';

import forming from '../index';
import type { FormingRule } from '../types';

const formingRules: FormingRule[] = [
  {
    selector: '.parent',
    nested: [
      { selector: '.children' }
    ]
  }
];

test('forming', async () => {
  const scssStr = fs.readFileSync(path.join(__dirname, 'fixtures/index.scss'), { encoding: 'utf-8'});
  const { scss } = await forming(scssStr, formingRules);

  expect(scss).toMatchSnapshot();
});
