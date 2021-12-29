import { Page } from '@ofa/ui';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'page',
  icon: 'apps',
  label: '页面',
  category: 'basic',
  component: Page,
  configForm: ConfigForm,
  defaultConfig,
  hidden: true,
  acceptChild: true,
  defaultStyle: {
    width: '960px',
    height: '100%',
  },
};

export default elem;
