import spec from './fixtures/petstore-spec';
import SwaggerAdapter from '../adapter-swagger';
import { RequestParams } from '../types';

const actions: Array<{ path: string; method: string; requestParams?: RequestParams; }> = [
  { path: '/pet', method: 'post' },
  { path: '/pet', method: 'put' },
  { path: '/pet/findByStatus', method: 'get' },
  { path: '/pet/findByTags', method: 'get' },
  { path: '/pet/{petId}', method: 'get' },
  { path: '/pet/{petId}', method: 'post' },
  { path: '/pet/{petId}', method: 'delete' },
  { path: '/pet/{petId}/uploadImage', method: 'post' },
  { path: '/store/inventory', method: 'get' },
  { path: '/store/order', method: 'post' },
  { path: '/store/order/{orderId}', method: 'get' },
  { path: '/store/order/{orderId}', method: 'delete' },
  { path: '/user', method: 'post' },
  { path: '/user/createWithArray', method: 'post' },
  { path: '/user/createWithList', method: 'post' },
  { path: '/user/login', method: 'get' },
  { path: '/user/logout', method: 'get' },
  { path: '/user/{username}', method: 'get' },
];

test('expect_specInterpreter_to_match_snapshots', () => {
  const builder = new SwaggerAdapter(spec);
  actions.forEach(({ path, method, requestParams }) => {
    expect(builder.build(path, method, requestParams)).toMatchSnapshot();
  });
});
