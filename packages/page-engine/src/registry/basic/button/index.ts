import { Button } from '@ofa/ui';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'button',
  icon: 'apps',
  label: '按钮',
  category: 'basic',
  component: Button,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
};

export default elem;
