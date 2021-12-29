import Divider from './divider';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'divider',
  icon: 'apps',
  label: '分割线',
  category: 'basic',
  component: Divider,
  configForm: ConfigForm,
  defaultConfig,
  order: 6,
};

export default elem;
