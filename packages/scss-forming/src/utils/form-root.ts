import postcss, { Root } from 'postcss';

import { plugins, processOptions } from '../constant';

export default function formRoot(root: Root | string): Promise<Root> {
  return postcss(plugins).process(root, processOptions).then(({ root }) => {
    if (root.type !== 'root') {
      throw new Error('astToRoot failed, the input ast is not root type!');
    }

    return root;
  });
}
