import FileUploader from './form-file-uploader';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'file_uploader',
  icon: 'attachment',
  label: '上传附件',
  category: 'form',
  component: FileUploader,
  configForm: ConfigForm,
  exportActions: ['onChange'],
  defaultConfig: DEFAULT_CONFIG,
  order: 8,
};

export default elem;
