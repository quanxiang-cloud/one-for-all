import Dialog from './dialog'
import ConfigForm, {defaultConfig, Props} from './config-form';
import type { SourceElement } from '../../../index';

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
  exportActions: ['onClose', 'onCancel', 'onConfirm'],
  defaultStyle: {},
};

export default elem;
