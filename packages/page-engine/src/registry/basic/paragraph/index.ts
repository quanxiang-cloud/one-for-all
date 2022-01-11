import { Paragraph } from '@ofa/ui';

import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'para',
  icon: 'text-component',
  label: '段落',
  iconSize: 48,
  category: 'basic',
  component: Paragraph,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
};

export default elem;
