import { SchemaComponent, uuid } from "@one-for-all/page-engine-v2";

import Button from '../../../page-engine-v2-components/button';
import Text from '../../../page-engine-v2-components/text';
import Input from '../../../page-engine-v2-components/input';

const components: SchemaComponent[] = [{
  id: uuid(),
  name: 'Button',
  label: '按钮',
  Preview: Button,
}, {
  id: uuid(),
  name: 'Text',
  label: '文本',
  Preview: Text,
}, {
  id: uuid(),
  name: 'Input',
  label: '输入框',
  Preview: Input,
}]

export default components;
