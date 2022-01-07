import { Textarea } from '@ofa/ui';
import type { SourceElement } from '@ofa/page-engine';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: SourceElement<Props> = {
  name: 'textarea',
  icon: 'featured_play_list',
  label: '多行文本',
  category: 'form',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  // acceptChild: true,
};

export default elem;
