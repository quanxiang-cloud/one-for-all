import React from 'react';
import { Artery, Node } from '@one-for-all/artery';
import { NodePrimary } from './types';

interface ArteryContext {
  artery: Artery;
  rootNodeID: string;
  activeNode?: Node;
  setActiveNode: (node?: Node) => void;
  isNodeSupportChildren?: (node: NodePrimary) => Promise<boolean>;
  onDropFile?: (file: File) => Promise<string>;
  onChange: (artery: Artery) => void;
  genNodeID: () => string;
}

export const ArteryCtx = React.createContext<ArteryContext>({
  // TODO fixme
  // @ts-ignore
  artery: { node: { type: 'html-element', name: 'div' } },
  setActiveNode: () => {},
  rootNodeID: '',
  onChange: () => {},
  genNodeID: () => 'gen_node_id_method_default_value_and_do_not_use_this',
});
