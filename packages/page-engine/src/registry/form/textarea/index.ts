import { Textarea } from '@one-for-all/ui';
import type { SourceElement } from '../../../index';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: SourceElement<Props> = {
  name: 'textarea',
  icon: 'text-component',
  label: '多行文本',
  category: 'form',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  // acceptChild: true,
  defaultStyle: {
    display: 'inline-block',
  },
  exportActions: ['onChange', 'onKeyDown', 'onBlur', 'onFocus'],
};

export default elem;
