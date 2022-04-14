import { AST } from '../types';
import formRoot from './form-root';

async function toAST(scss: string): Promise<AST> {
  const root = await formRoot(scss);

  const ast = root.toJSON();

  // @ts-ignore
  ast.inputs[0].css = '';
  return ast;
}

export default toAST;
