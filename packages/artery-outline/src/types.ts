import { HTMLNode, ReactComponentNode } from '@one-for-all/artery';

export type NodePrimary =
  | Pick<HTMLNode, 'type' | 'name'>
  | Pick<ReactComponentNode, 'type' | 'packageName' | 'packageVersion' | 'exportName'>;

export type CollapsedStatus = 'none' | 'collapsed' | 'expended';

export interface Entry {
  id: string;
  name: string;
  depth: number;
  isContainer: boolean;
}
