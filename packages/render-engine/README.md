# Render Engine turns Schema into real UI

Use [Schema](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/schema-spec/src/index.d.ts) to describe your web page logic,
then use Render Engine to make it into real UI.

## Get Start

Install render engine use npm or yarn:

```bash
npm install @one-for-all/render-engine
```

Import render engine in your source file:

```jsx
import React from 'react';
import { RefLoader, Repository, SchemaRender } from '@one-for-all/render-engine';

function Demo() {
  const schema = getSchemaBySomeway();

  return (<SchemaRender schema={schema} />);
}

```
## Example

please checkout our [example repo](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example) for more.
