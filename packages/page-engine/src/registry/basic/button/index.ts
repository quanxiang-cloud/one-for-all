import ButtonElem from './button';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'button',
  icon: 'button-component',
  iconSize: 48,
  label: '按钮',
  category: 'basic',
  component: ButtonElem,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
};

export default elem;
