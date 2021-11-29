import type { DynamicComponent } from './types';

type ComponentURLResolver = (componentName: string, version?: string) => string;
// TODO: support import const value and prune functions
type Importer = (systemModule: System.Module, componentName: string, version?: string) => DynamicComponent;

export type RegistryOptions = {
  componentURLResolver: ComponentURLResolver;
  importer?: Importer;
  injectDependencies?: () => Promise<boolean>;
}

// function defaultImporter(systemModule: System.Module): unknown {
//   return systemModule.default;
// }

const repository: Record<string, RegistryOptions> = {};

// register a components namespace
export function register(nameSpace: string, options: RegistryOptions): void {
  repository[nameSpace] = options;
}

type ImportComponentParams = {
  packageName: string;
  version: string;
  exportName?: string;
}

// todo how to concat packageName and packageVersion?
export function importComponent(
  { packageName, exportName }: ImportComponentParams,
): Promise<DynamicComponent> {
  return System.import(packageName).then((systemModule) => {
    return systemModule[exportName || 'default'];
  });
}
