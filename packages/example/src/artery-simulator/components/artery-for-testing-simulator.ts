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
        exportName: 'Normal',
        props: {
          name: {
            type: 'constant_property',
            value: 'normal-component 1'
          }
        }
      },
      {
        id: 'normal-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'WillThrow',
        props: {
          name: {
            type: 'constant_property',
            value: 'normal-component 1'
          }
        }
      },
      {
        id: 'a-dev',
        type: 'html-element',
        name: 'div',
      },
      {
        id: 'cards-wrapper',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: 'constant_property',
            value: { padding: '20px' },
          },
        },
        children: [
          {
            id: 'card-1',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-1',
              },
            },
          },
          {
            id: 'card-2',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-2',
              },
            },
          },
          {
            id: 'card-3',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-3',
              },
            },
          },
          {
            id: 'card-4',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-4',
              },
            },
          },
          {
            id: 'card-5',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-5',
              },
            },
          },
          {
            id: 'card-6',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-6',
              },
            },
          },
          {
            id: 'card-7',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-7',
              },
            },
          },
          {
            id: 'card-8',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-8',
              },
            },
          },
          {
            id: 'card-9',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-9',
              },
            },
          },
          {
            id: 'card-10',
            type: 'react-component',
            packageName: 'SimulatorDedicated',
            packageVersion: 'whatever',
            exportName: 'Card',
            props: {
              id: {
                type: 'constant_property',
                value: 'card-10',
              },
            },
          },
        ],
      },
      {
        id: 'return-dom-list-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'ReturnDomList',
      },
      {
        id: 'return-null-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'ReturnNull',
      },
      {
        id: 'will-return-dom-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'WillReturnDom',
      },
      {
        id: 'will-return-null-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'WillReturnNull',
      },
      {
        id: 'will-return-different-dom-component',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'willReturnDifferentDom',
      },
      {
        id: 'normal-component-bottom',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'Normal',
        props: {
          name: {
            type: 'constant_property',
            value: 'normal-component 2'
          }
        }
      },
      {
        id: 'normal-component-bottom-1',
        type: 'react-component',
        packageName: 'SimulatorDedicated',
        packageVersion: 'whatever',
        exportName: 'Normal',
        props: {
          name: {
            type: 'constant_property',
            value: 'normal-component 3'
          }
        }
      },
    ],
  },
};

export default arteryForTestingSimulator;
