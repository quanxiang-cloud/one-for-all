import type { SourceElement } from '../../../index';

import Iframe from './iframe';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'iframe',
  icon: 'iframe-component',
  label: 'Iframe',
  category: 'advanced',
  component: Iframe,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 3,
};

export default elem;
