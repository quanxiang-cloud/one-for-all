import Iframe from './iframe';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'iframe',
  icon: 'apps',
  label: 'Iframe',
  category: 'advanced',
  component: Iframe,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
};

export default elem;
