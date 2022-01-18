import { Link } from '@ofa/ui';
import type { SourceElement } from '@ofa/page-engine';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'link',
  icon: 'hyper-link',
  label: '链接',
  category: 'basic',
  component: Link,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 8,
};

export default elem;
