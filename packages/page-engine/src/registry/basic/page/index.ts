import { Page } from '@ofa/ui';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'page',
  icon: 'apps',
  label: '页面',
  category: 'basic',
  component: Page,
  configForm: ConfigForm,
  defaultConfig,
  hidden: true,
  acceptChild: true,
};

export default elem;
