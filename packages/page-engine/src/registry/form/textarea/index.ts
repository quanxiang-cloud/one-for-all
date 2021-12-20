import { Textarea } from '@ofa/ui';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: Registry.SourceElement<Props> = {
  name: 'textarea',
  icon: 'apps',
  label: '多行文本',
  category: 'form',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  // acceptChild: true,
};

export default elem;
