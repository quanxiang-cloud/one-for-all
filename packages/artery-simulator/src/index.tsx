import React, { useEffect, useRef } from 'react';
import type { Artery, Node } from '@one-for-all/artery';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence, { InjectElement } from './fence';
import Messenger from './messenger';

import { NodePrimary } from './types';
import { useSyncResponders, useSyncArtery, useSyncActiveNode, useSyncActiveModalLayer } from './sync-hooks';
import { MESSAGE_TYPE_ARTERY } from './simulator/constants';
import { useState } from 'react';

const headElements: InjectElement[] = [
  {
    name: 'script',
    attrs: { type: 'systemjs-importmap' },
    innerText: `{
      "imports": {
        "react": "https://ofapkg.pek3b.qingstor.com/react@17.0.1/react.17.0.1.js",
        "react-dom": "https://ofapkg.pek3b.qingstor.com/react-dom@17.0.1/react-dom.17.0.1.js",
        "rxjs/ajax": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-ajax.min.js",
        "rxjs/fetch": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-fetch.min.js",
        "rxjs/operators": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-operators.min.js",
        "rxjs/shared": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-shared.min.js",
        "rxjs/testing": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-testing.min.js",
        "rxjs/websocket": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-websocket.min.js",
        "rxjs": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs.min.js",
        "history": "https://ofapkg.pek3b.qingstor.com/@one-for-all/history@5.3.0/index.min.js",
        "lodash": "https://unpkg.com/lodash@4.17.21/lodash.js",
        "react-jsx-parser": "https://ofapkg.pek3b.qingstor.com/@one-for-all/react-jsx-parser@1.29.0/index.min.js"
      }
    }`,
  },
  {
    name: 'script',
    attrs: { type: 'systemjs-importmap' },
    innerText: `{
      "imports": {
        "@one-for-all/api-spec-adapter": "https://ofapkg.pek3b.qingstor.com/@one-for-all/api-spec-adapter@latest/index.min.js",
        "@one-for-all/artery-renderer": "${window.origin}/pkg/artery-renderer/dist/@one-for-all/artery-renderer@latest/index.js",
        "@one-for-all/artery-simulator": "${window.origin}/pkg/artery-simulator/dist/@one-for-all/artery-simulator@latest/index.js",
        "@one-for-all/artery-engine": "${window.origin}/pkg/artery-engine/dist/@one-for-all/artery-engine@latest/index.js",
        "@one-for-all/artery-utils": "${window.origin}/pkg/artery-utils/dist/@one-for-all/artery-utils@latest/index.js",
        "@one-for-all/elements-radar": "${window.origin}/pkg/elements-radar/dist/@one-for-all/elements-radar@latest/index.js",
        "@one-for-all/headless-ui": "${window.origin}/pkg/headless-ui/dist/@one-for-all/headless-ui@latest/web.js",
        "@one-for-all/headless-ui/components-interface.json": "${window.origin}/pkg/headless-ui/dist/@one-for-all/headless-ui@latest/components-interface.json",
        "@one-for-all/icon": "${window.origin}/pkg/icon/dist/@one-for-all/icon@latest/index.js",
        "@one-for-all/scss-forming": "${window.origin}/pkg/scss-forming/dist/@one-for-all/scss-forming@latest/index.js",
        "@one-for-all/style-guide": "${window.origin}/pkg/style-guide/dist/@one-for-all/style-guide@0.1.5/index.js",
        "@one-for-all/ui": "${window.origin}/pkg/ui/dist/@one-for-all/ui@latest/index.min.js",
        "@one-for-all/utils": "${window.origin}/pkg/utils/dist/@one-for-all/utils@latest/index.min.js",
        "csslint": "${window.origin}/pkg/style-guide/dist/@one-for-all/style-guide@0.1.5/csslint.js"
      }
    }`
  },
  {
    name: 'script',
    attrs: { type: 'systemjs-importmap' },
    innerText: `{
      "imports": {
        "temporaryPlugins": "${window.origin}/dist/temporaryPlugins.js"
      }
    }`
  },
  {
    name: 'script',
    attrs: { src: 'https://ofapkg.pek3b.qingstor.com/system@6.10.3/system.6.10.3.min.js' },
  },
  {
    name: 'script',
    attrs: { src: simulatorDDL },
  },
]

interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer?: string) => void;

  // todo plugin url
  plugins?: string;
  className?: string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
}

function Simulator({
  activeModalLayer,
  activeNode,
  artery,
  className,
  isNodeInModalLayer,
  isNodeSupportChildren,
  onChange,
  plugins,
  setActiveModalLayer,
  setActiveNode,
}: Props): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messenger, setMessenger] = useState<Messenger>();
  const [iframeLoad, setIframeLoad] = useState(false);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !iframeLoad) {
      return;
    }

    const msgr = new Messenger(iframeRef.current?.contentWindow, 'host-side');
    msgr.waitForReady().then(() => {
      msgr.send(MESSAGE_TYPE_ARTERY, artery);
    });

    setMessenger(msgr);
  }, [iframeLoad]);

  useSyncResponders(messenger, isNodeInModalLayer, isNodeSupportChildren);
  useSyncArtery(messenger, onChange, artery);
  useSyncActiveNode(messenger, setActiveNode, activeNode);
  useSyncActiveModalLayer(messenger, setActiveModalLayer, activeModalLayer);

  return (<Fence ref={iframeRef} className={className} headElements={headElements} onLoad={() => setIframeLoad(true)} />);
}

export default Simulator;
