import postcss from 'postcss';
import postcssScss from 'postcss-scss';
import { AST } from './types';

export default function toAST(scssStr: string): Promise<AST> {
  return postcss([]).process(
    scssStr,
    {
      from: 'index.scss',
      to: 'index.css',
      parser: postcssScss.parse,
      stringifier: postcssScss.stringify,
      map: false,
    }
  ).then((result) => {
    const ast = result.root.toJSON();
    // @ts-ignore
    ast.inputs[0].css = '';
    return ast;
  });
}
