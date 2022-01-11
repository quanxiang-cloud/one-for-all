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
  label: '文本',
  category: 'basic',
  component: Text,
  configForm: ConfigForm,
  defaultConfig,
  defaultStyle: {
    display: 'inline',
  },
  order: 1,
};

export default elem;
