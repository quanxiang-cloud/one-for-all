import React from 'react';
import { CTX, SchemaNode } from '../types';

function useLinkProps(node: SchemaNode, ctx: CTX): Record<string, unknown> {
  if ('isLink' in node && node.isLink && node.type === 'html-element' && node.name === 'a') {
    return {
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        // todo proxy onClick event
        e.stopPropagation();
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).href;
        if (!href) {
          return;
        }
        ctx.history.push(href);
      }
    };
  }

  return {};
}

export default useLinkProps;
