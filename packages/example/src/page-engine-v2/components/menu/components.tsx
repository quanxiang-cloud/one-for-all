import { SchemaComponent, uuid } from "@one-for-all/page-engine-v2";

import Button from '../canvas/components/button';
import Text from '../canvas/components/text';
import Input from '../canvas/components/input';

const components: SchemaComponent[] = [{
  id: uuid(),
  name: 'Button',
  ...Button,
}, {
  id: uuid(),
  name: 'Text',
  ...Text,
}, {
  id: uuid(),
  name: 'Input',
  ...Input,
}]

export default components;
