// import Para from './paragraph';

import { Paragraph } from '@ofa/ui';

import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'para',
  icon: 'apps',
  label: '段落',
  category: 'basic',
  component: Paragraph,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
};

export default elem;
