import PageEngine2, { Layer } from '@one-for-all/page-engine-v2';

import Header from './components/header';
import Canvas from './components/canvas';
import Menu from './components/menu';
import Config from './components/config';
import Input from './components/canvas/components/input';
import Button from './components/canvas/components/button';
import Text from './components/canvas/components/text';

export {
  Input,
  Button,
  Text,
}

const schema: SchemaSpec.Schema = {
  node: {
    type: 'html-element',
    name: 'div',
    children: [
      {type: 'react-component', id: '1', packageName: '@one-for-all/example', packageVersion: '0.0.1', exportName: 'Text', label: '文本'},
      {type: 'react-component', id: '2', packageName: '@one-for-all/example', packageVersion: '0.0.1', exportName: 'Button', label: '按钮'},
      {type: 'react-component', id: '3', packageName: '@one-for-all/example', packageVersion: '0.0.1', exportName: 'Input', label: '输入框'},
    ],
    id: 'canvas-container',
  }
};

interface BlocksCommunicationState {
  activeNodeID: string;
}

const layers: Layer<BlocksCommunicationState>[] = [{
  gridTemplateColumns: "1fr 4fr 1fr",
  gridTemplateRows: "1fr 10fr",
  blocks: [{
    gridColumnStart: "span 3",
    render: Header,
  }, {
    render: Menu,
  }, {
    render: Canvas,
  }, {
    render: Config,
  }],
  blocksCommunicationStateInitialValue: { activeNodeID: '' },
}]

const EngineInstance = new PageEngine2(schema, layers);
const el = document.getElementById('app');
if (!el?.childElementCount) {
  EngineInstance.render('app');
}
