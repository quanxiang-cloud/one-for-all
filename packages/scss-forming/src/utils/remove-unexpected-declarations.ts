import { Root } from 'postcss';

import decls from './accepted-decls';

const acceptedDecls = new Set<string>(decls);

function removeUnexpectedDecls(root: Root): void {
  root.walkDecls((declaration) => {
    if (!acceptedDecls.has(declaration.prop)) {
      declaration.remove();
    }
  });
}

export default removeUnexpectedDecls;
