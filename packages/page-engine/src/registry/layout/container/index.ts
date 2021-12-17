import { Container } from '@ofa/ui';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'container',
  icon: 'apps',
  label: '容器',
  category: 'layout',
  component: Container,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
  acceptChild: true,
  expose: {},
};

export default elem;
