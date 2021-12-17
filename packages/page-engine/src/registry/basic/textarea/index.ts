import { Textarea } from '@ofa/ui';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: Registry.SourceElement<Props> = {
  name: 'text2',
  icon: 'apps',
  label: 'textarea',
  category: 'basic',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 8,
  acceptChild: true,
};

export default elem;
