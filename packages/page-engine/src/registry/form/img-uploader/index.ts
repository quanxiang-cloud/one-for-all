import ImgUploader from './form-img-uploader';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'img_uploader',
  icon: 'image',
  label: '上传图片',
  category: 'form',
  component: ImgUploader,
  configForm: ConfigForm,
  exportActions: ['onChange'],
  defaultConfig: DEFAULT_CONFIG,
  order: 9,
};

export default elem;
