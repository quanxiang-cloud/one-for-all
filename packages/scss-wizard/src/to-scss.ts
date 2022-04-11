import postcss from 'postcss';
import postcssScss from 'postcss-scss';
import format from './format';

export default function toSCSS(ast: Object): Promise<string> {
  return postcss([]).process(postcss.fromJSON(ast), {
    from: 'index.scss',
    to: 'index.css',
    parser: postcssScss.parse,
    stringifier: postcssScss.stringify,
    map: false,
  }).then((result) => {
    if (process.env.NODE_ENV === 'test') {
      return result.css
    }

    return format(result.css);
  })
}
