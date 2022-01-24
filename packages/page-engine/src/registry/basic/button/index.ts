import type { SourceElement } from '../../../index';

import ButtonElem from './button';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'button',
  icon: 'button-component',
  label: '按钮',
  category: 'basic',
  component: ButtonElem,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 4,
  defaultStyle: {},
  exportActions: ['onClick'],
};

export default elem;
