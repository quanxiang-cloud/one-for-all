import type { Artery } from '@one-for-all/artery';

const simulatorArtery: Artery = {
  node: {
    id: 'simulator-wrapper',
    type: 'react-component',
    packageName: 'SimulatorInExample',
    packageVersion: 'whatever',
    exportName: 'default',
  },
};

export default simulatorArtery;
