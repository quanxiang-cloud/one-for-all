import MultiSelect from './multi-select';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'multi_select',
  icon: 'apps',
  label: '下拉多选',
  category: 'form',
  component: MultiSelect,
  configForm: ConfigForm,
  defaultConfig,
  order: 6,
};

export default elem;
