import { Paragraph } from '@ofa/ui';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'para',
  icon: 'text-component',
  label: '段落',
  category: 'basic',
  component: Paragraph,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  exportActions: ['onClick'],
};

export default elem;
