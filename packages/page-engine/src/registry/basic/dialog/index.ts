import Dialog from './dialog';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'dialog',
  icon: 'apps',
  label: '对话框',
  category: 'basic',
  component: Dialog,
  configForm: ConfigForm,
  defaultConfig,
  order: 5,
};

export default elem;
