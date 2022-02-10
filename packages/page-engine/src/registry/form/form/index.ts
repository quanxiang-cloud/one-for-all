import Form from './form';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'form',
  icon: 'apps',
  label: '表单',
  category: 'form',
  component: Form,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 3,
  acceptChild: true,
  exportActions: ['onSubmit'],
  defaultStyle: {
    display: 'block',
  },
};
export default elem;
