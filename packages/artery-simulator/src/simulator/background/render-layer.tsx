import React, { useState } from 'react';
import { Plugins, useBootResult } from '@one-for-all/artery-renderer';
import NodeRender from './node-render';
import useElementsRadar from './use-radar-ref';
import { Artery } from '@one-for-all/artery';
import { ContourNodesReport } from '../../types';
import { artery$ } from '../bridge';
import { useBehaviorSubjectState } from '../utils';

interface Props {
  plugins?: Plugins;
  onReport: (report?: ContourNodesReport) => void;
  artery?: Artery;
}

export default function RenderLayer({ artery, plugins, onReport }: Props): JSX.Element | null {
  const _artery = useBehaviorSubjectState(artery$);
  const { ctx, rootNode } = useBootResult(artery || _artery, plugins) || {};
  const [rootElement, setRootElement] = useState<HTMLDivElement>();
  useElementsRadar(onReport, rootElement);

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div
      className="simulator-background"
      ref={(ref) => {
        if (ref) {
          setRootElement(ref);
        }
      }}
    >
      {rootElement && (<NodeRender node={rootNode} ctx={ctx} />)}
    </div>
  );
}
