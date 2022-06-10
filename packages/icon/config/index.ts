import propsSpec from './props-spec.json';
import getManifest from './manifest';

const manifest = await getManifest();

export const params = [{
  key: 'PACKAGE_MANIFEST:@one-for-all/icon',
  version: '0.6.2',
  value: JSON.stringify(manifest)
}]
// __httpClient('/api/v1/persona/batchSetValue', { keys: params });

export const specParams = [{
  key: 'PACKAGE_PROPS_SPEC:@one-for-all/icon',
  version: '0.6.2',
  value: JSON.stringify(propsSpec),
}]
// __httpClient('/api/v1/persona/batchSetValue', { keys: specParams });
