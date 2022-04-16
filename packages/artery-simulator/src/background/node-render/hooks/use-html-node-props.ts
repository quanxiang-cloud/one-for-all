import { useRef, useEffect } from 'react';
import { CTX, HTMLNode } from '@one-for-all/artery-renderer';
import { useInstantiateProps } from '@one-for-all/artery-renderer';
import useElementRegistration from './use-element-registration';

export default function useHTMLNodeProps(node: HTMLNode, ctx: CTX): Record<string, unknown> {
  const props = useInstantiateProps(node, ctx);
  const { register, unregister } = useElementRegistration();
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }

    return () => {
      if (ref.current) {
        unregister(ref.current);
      }
    };
  }, []);

  // todo support forward ref case
  return { ...props, ref, 'data-simulator-node-id': node.id };
}
