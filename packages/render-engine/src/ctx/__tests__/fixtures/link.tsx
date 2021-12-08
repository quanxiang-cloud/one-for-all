import React, { useEffect } from 'react';
import { SchemaNode } from '../../..';
import { APIInvokeProperty, APIResultProperty, Instantiated, CTX } from '../../../types';
import useInstantiateProps from '../../../use-instantiate-props';

type Props = {
  nodeProps: Record<string, APIInvokeProperty<Instantiated> | APIResultProperty<Instantiated>>;
  ctx: CTX;
}

export default function Link({ nodeProps, ctx }: Props): JSX.Element {
  const node: SchemaNode<Instantiated> = {
    id: 'link',
    type: NodeType.HTMLNode,
    props: nodeProps,
    name: 'div',
  };
  const { foo, bar, onFetch } = useInstantiateProps(node, ctx);

  useEffect(() => {
    onFetch();
    // useEffect MUST have an empty dependance list,
    // otherwise test will never end
    // why???
    // https://github.com/testing-library/react-testing-library/issues/242
  }, []);

  return (
    <button id="button" onClick={onFetch}>{`${foo}:${bar}`}</button>
  );
}
