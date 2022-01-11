import { Link } from '@ofa/ui';

import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'link',
  icon: 'hyper-link',
  label: '链接',
  category: 'basic',
  component: Link,
  configForm: ConfigForm,
  defaultConfig,
  order: 8,
};

export default elem;
