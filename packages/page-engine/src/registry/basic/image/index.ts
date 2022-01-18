import { Image } from '@ofa/ui';
import type { SourceElement } from '@ofa/page-engine';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'image',
  icon: 'image-component',
  label: '图片',
  category: 'basic',
  component: Image,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 3,
};

export default elem;
