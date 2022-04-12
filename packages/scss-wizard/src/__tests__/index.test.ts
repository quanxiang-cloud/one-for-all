jest.mock('../format');

import fs from 'fs';
import path from 'path';

import toSCSS from '../to-scss';
import toAST from '../to-ast';

test('convert_between_ast_and_scss', async () => {
  const scssStr = fs.readFileSync(path.join(__dirname, 'fixtures/index.scss'), { encoding: 'utf-8'});
  const ast = await toAST(scssStr);
  expect(ast.nodes).toMatchSnapshot();

  const scss = await toSCSS(ast);
  expect(scss).toMatchSnapshot();

  const _ast = await toAST(scss);
  expect(_ast.nodes).toEqual(ast.nodes);
});
