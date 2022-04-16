import type { Artery } from '@one-for-all/artery';

const arteryForTestingSimulator: Artery = {
  node: {
    id: 'artery-testing-simulator-root',
    type: 'html-element',
    name: 'div',
    children: [
      {
        id: 'normal-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'Normal'
      },
      {
        id: 'cards-wrapper',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: 'constant_property',
            value: { padding: '20px' }
          }
        },
        children: [
          {
            id: 'card-1',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-2',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-3',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-4',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-5',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-6',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-7',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-8',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-9',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
          {
            id: 'card-10',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card'
          },
        ]
      },
      {
        id: 'return-dom-list-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'ReturnDomList'
      },
      {
        id: 'return-null-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'ReturnNull'
      },
      {
        id: 'will-return-dom-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'WillReturnDom'
      },
      {
        id: 'will-return-null-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'WillReturnNull'
      },
      {
        id: 'will-return-different-dom-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'willReturnDifferentDom'
      },
      {
        id: 'normal-component-bottom',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'Normal'
      },
      {
        id: 'normal-component-bottom-1',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'Normal'
      },
    ]
  }

};

export default arteryForTestingSimulator;
