import { Text } from '@one-for-all/ui';
import type { SourceElement } from '../../../index';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'text',
  icon: 'text-component',
  label: '文本',
  category: 'basic',
  component: Text,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  defaultStyle: {
    display: 'inline',
  },
  exportActions: ['onClick'],
  order: 1,
};

export default elem;
