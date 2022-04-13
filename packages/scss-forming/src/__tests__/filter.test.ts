jest.mock('../format');
import fs from 'fs';
import path from 'path';
import toAST from '../to-ast';
import toSCSS from '../to-scss';
import { FormingRule } from '../types';

const selectorWhiteList: FormingRule[] = [
  {
    selector: '.button',
    nestedSelectors: [
      { selector: '.icon' },
      { selector: '&:hover' }
    ]
  },
  {
    selector: '.button--danger'
  }
];

test('toAST_should_throw_if_encounter_bad_scss', async () => {
  const bemSCSS = fs.readFileSync(path.join(__dirname, 'fixtures/bem.scss'),  { encoding: 'utf-8' });
  const ast = await toAST(bemSCSS, selectorWhiteList);

  const scss = await toSCSS(ast);
  console.log(scss);

  expect(ast.nodes).toMatchSnapshot();
});
