import ConfigForm from './config-form';

import { Image } from '@ofa/ui';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'image',
  icon: 'image',
  label: '图片',
  category: 'basic',
  component: Image,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
};

export default elem;
