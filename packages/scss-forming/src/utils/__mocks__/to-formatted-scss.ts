import { AST } from '../../types';

export default function format(ast: AST): Promise<string> {
  return Promise.resolve(ast.toString?.() || '');
}
