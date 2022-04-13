import postcss from 'postcss';
import postcssScss from 'postcss-scss';
import format from './format';
import { AST } from './types';

export default function toSCSS(ast: AST): Promise<string> {
  return postcss([]).process(postcss.fromJSON(ast), {
    from: 'index.scss',
    to: 'index.css',
    parser: postcssScss.parse,
    stringifier: postcssScss.stringify,
    map: false,
  }).then((result) => {
    return format(result.css);
  });
}
