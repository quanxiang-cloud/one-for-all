import manifest from './manifest.json'
import propsSpec from './props-spec.json';
import pkg from '../package.json';

export const params = [{
  key: 'PACKAGE_MANIFEST:@one-for-all/headless-ui',
  version: pkg.version,
  value: JSON.stringify(manifest)
}]
// __httpClient('/api/v1/persona/batchSetValue', { keys: params });

export const specParams = [{
  key: 'PACKAGE_PROPS_SPEC:@one-for-all/headless-ui',
  version: pkg.version,
  value: JSON.stringify(propsSpec),
}]
// __httpClient('/api/v1/persona/batchSetValue', { keys: specParams });
