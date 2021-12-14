import Textarea from './textarea';
import ConfigForm, { defaultConfig } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  required: boolean,
  disable: boolean,
  name: string,
}

const elem: Registry.SourceElement<Props> = {
  name: 'text2',
  icon: 'apps',
  label: 'textarea',
  category: 'basic',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig,
  order: 8,
  acceptChild: true,
};

export default elem;
