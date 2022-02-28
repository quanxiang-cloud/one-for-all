import DatePicker from './date';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'date',
  icon: 'apps',
  label: '日期选择',
  category: 'form',
  component: DatePicker,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 7,
  exportActions: ['onChange'],
};

export default elem;
