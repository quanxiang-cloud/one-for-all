import { customAlphabet } from 'nanoid';

export const uuid = customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 8);

export interface LoadPackcageProps {
  packageName: string;
  packageVersion: string;
  exportName: string;
}
export async function loadPackage<T>({ packageName, packageVersion, exportName }: LoadPackcageProps, defaultValue: T): Promise<T> {
  try {
    const packagePath = `${packageName}@${packageVersion}`;
    const component = await System.import(packagePath);
    return component[exportName];
  } catch (error) {
    return defaultValue;
  }
}

export interface SchemaComponent {
  id: string;
  name: string;
  // eslint-disable-next-line @rushstack/no-new-null
  Preview: () => JSX.Element | null;
  // eslint-disable-next-line @rushstack/no-new-null
  Render: () => JSX.Element | null;
}
export async function loadComponentsFromSchema(schema: PageEngineV2.Schema): Promise<SchemaComponent[]> {
  if (schema.node?.type === 'html-element' && schema.node.children) {
    const componentsInPromise = schema.node.children
      .map(async (node) => {
        if (node.type === 'react-component') {
          const { Preview, Render } = await loadPackage<Pick<SchemaComponent, 'Preview' | 'Render'>>(node, { Preview: () => null, Render: () => null });
          return {
            id: node.id,
            name: node.exportName,
            Preview,
            Render
          }
        }
        return false;
      })
      .filter(Boolean) as Promise<SchemaComponent>[];
    return await Promise.all(componentsInPromise ?? []);
  }
  return [];
}
