import Image from './image';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'image',
  icon: 'image',
  label: '图片',
  category: 'basic',
  component: Image,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
};

export default elem;
