import postcss, { Root } from 'postcss';
import postcssScss from 'postcss-scss';

export default function toSCSS(ast: Object): Promise<string> {
  return postcss([]).process(postcss.fromJSON(ast), {
    from: 'index.scss',
    to: 'index.css',
    parser: postcssScss.parse,
    stringifier: postcssScss.stringify,
    map: false,
  }).then((result) => {
    return result.css;
  })
}
