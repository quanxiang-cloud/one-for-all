jest.mock('../format');

import fs from 'fs';
import path from 'path';

import toSCSS from '../to-scss';
import toAST from '../to-ast';
import { Selector } from '../types';

const selectorWhiteList: Selector[] = [
  {
    selector: '.parent',
    nestedSelector: [
      { selector: '.children' }
    ]
  }
];

test('convert_between_ast_and_scss', async () => {
  const scssStr = fs.readFileSync(path.join(__dirname, 'fixtures/index.scss'), { encoding: 'utf-8'});
  const ast = await toAST(scssStr, selectorWhiteList);
  expect(ast.nodes).toMatchSnapshot();

  const scss = await toSCSS(ast);
  expect(scss).toMatchSnapshot();
});
