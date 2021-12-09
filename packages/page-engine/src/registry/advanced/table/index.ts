import Table from './table';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'table',
  icon: 'apps',
  label: '表格',
  category: 'advanced',
  component: Table,
  configForm: ConfigForm,
  defaultConfig,
  order: 1,
};

export default elem;
