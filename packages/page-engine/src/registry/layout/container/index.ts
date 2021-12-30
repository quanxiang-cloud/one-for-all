import { Container } from '@ofa/ui';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'container',
  icon: 'apps',
  label: '容器',
  category: 'layout',
  component: Container,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
  acceptChild: true,
  exportActions: [],
};

export default elem;
