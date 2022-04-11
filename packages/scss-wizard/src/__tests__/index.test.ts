import fs from 'fs';
import { toAST, toSCSS } from "..";

test('demo', async () => {
  const scssStr = fs.readFileSync('./src/__tests__/demo.scss', { encoding: 'utf-8'})
  const ast = await toAST(scssStr)
  // @ts-ignore
  expect(ast.nodes).toMatchSnapshot()
})

test('toSCSS', async () => {
  const scssStr = fs.readFileSync('./src/__tests__/demo.scss', { encoding: 'utf-8'})
  const ast = await toAST(scssStr);
  console.log(JSON.stringify(ast))

  const scss = await toSCSS(ast);
  expect(scss).toMatchSnapshot();
})
