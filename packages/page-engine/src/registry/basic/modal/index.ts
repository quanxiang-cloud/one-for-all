import Dialog from './dialog'
import ConfigForm from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'modal',
  icon: 'grid-12',
  label: '模态框',
  category: 'basic',
  component: Dialog,
  configForm: ConfigForm,
  defaultConfig,
  order: 9,
  acceptChild: true,
  exportActions: ['onClose', 'onOpen', 'onCancel', 'onSubmit'],
  defaultStyle: {},
};

export default elem;
