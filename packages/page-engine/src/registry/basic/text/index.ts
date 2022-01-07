import { Text } from '@ofa/ui';

import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'text',
  icon: 'text-component',
  iconSize: 32,
  // iconStyle: {
  //   width: '48px',
  //   height: '24px',
  // },
  label: '文本',
  category: 'basic',
  component: Text,
  configForm: ConfigForm,
  defaultConfig,
  defaultStyle: {
    width: '100px',
    height: '20px',
  },
  order: 1,
};

export default elem;
