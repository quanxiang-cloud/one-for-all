import React, { PropsWithChildren } from 'react';

import {
  CTX,
  HTMLNode,
  ReactComponentNode,
  ComposeOutLayer,
} from '../../types';
import useInstantiateProps from '../../use-instantiate-props';
import { useLifecycleHook, useNodeComponent } from '../hooks';

type HTMLOutLayerRenderProps = PropsWithChildren<{
  outLayer: Omit<HTMLNode, 'children'>;
  ctx: CTX;
}>

function HTMLOutLayerRender({ outLayer, ctx, children }: HTMLOutLayerRenderProps): React.ReactElement {
  const props = useInstantiateProps(outLayer, ctx);
  return React.createElement(outLayer.name, props, children);
}

type ReactComponentOutLayerRenderProps = PropsWithChildren<{
  outLayer: Omit<ReactComponentNode, 'children'>;
  ctx: CTX;
}>

function ReactComponentOutLayerRender(
  { outLayer, ctx, children }: ReactComponentOutLayerRenderProps,
): React.ReactElement | null {
  const props = useInstantiateProps(outLayer, ctx);
  const nodeComponent = useNodeComponent(outLayer, ctx.repository);
  useLifecycleHook(outLayer.lifecycleHooks || {});

  if (!nodeComponent) {
    return null;
  }

  return React.createElement(nodeComponent, props, children);
}

type Props = PropsWithChildren<{
  outLayer?: ComposeOutLayer;
  ctx: CTX;
}>

export default function OutLayerRender({ outLayer, ctx, children }: Props): React.ReactElement | null {
  if (outLayer?.type === 'html-element') {
    return React.createElement(HTMLOutLayerRender, { outLayer, ctx }, children);
  }

  if (outLayer?.type === 'react-component') {
    return React.createElement(ReactComponentOutLayerRender, { outLayer, ctx }, children);
  }

  return React.createElement(React.Fragment, null, children);
}
