import { Link } from '@ofa/ui';

import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'link',
  icon: 'apps',
  label: '链接',
  category: 'basic',
  component: Link,
  configForm: ConfigForm,
  defaultConfig,
  order: 8,
};

export default elem;
