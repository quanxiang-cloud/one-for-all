import React from 'react';
import { ArteryNode } from '../types';
import useCTX from '../use-ctx';

function useLinkProps(node: ArteryNode): Record<string, unknown> {
  const ctx = useCTX();
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
      },
    };
  }

  return {};
}

export default useLinkProps;
