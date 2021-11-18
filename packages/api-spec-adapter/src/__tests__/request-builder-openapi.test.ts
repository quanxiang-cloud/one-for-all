import spec from './fixtures/petstore-spec';
import SwaggerAdapter from '../adapter-swagger';
import { RequestParams } from '../types';

const actions: Array<{ path: string; method: string; requestParams?: RequestParams; }> = [
  {
    path: '/pet',
    method: 'post',
    requestParams: { body: { foo: 'bar' } },
  },
  {
    path: '/pet',
    method: 'put',
    requestParams: { body: { foo: 'bar' } },
  },
  {
    path: '/pet/findByStatus',
    method: 'get',
    requestParams: { params: { status: ['available', 'pending', 'sold'] } },
  },
  {
    path: '/pet/findByTags',
    method: 'get',
    requestParams: { params: { tags: ['tag1', 'tag2', 'tag3'] } },
  },
  {
    path: '/pet/{petId}',
    method: 'get',
    requestParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/pet/{petId}',
    method: 'post',
    requestParams: { params: { petId: 'some_pet_id' }, body: { name: 'foo', status: 'alive' } },
  },
  {
    path: '/pet/{petId}',
    method: 'delete',
    requestParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/pet/{petId}/uploadImage',
    method: 'post',
    requestParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/store/inventory',
    method: 'get',
  },
  {
    path: '/store/order',
    method: 'post',
    requestParams: { body: { foo: 'bar' } },
  },
  {
    path: '/store/order/{orderId}',
    method: 'get',
  },
  {
    path: '/store/order/{orderId}',
    method: 'delete',
  },
  {
    path: '/user',
    method: 'post',
  },
  {
    path: '/user/createWithArray',
    method: 'post',
  },
  {
    path: '/user/createWithList',
    method: 'post',
  },
  {
    path: '/user/login',
    method: 'get',
  },
  {
    path: '/user/logout',
    method: 'get',
  },
  {
    path: '/user/{username}',
    method: 'get',
  },
];

test('expect_specInterpreter_to_match_snapshots', () => {
  const builder = new SwaggerAdapter(spec);
  actions.forEach(({ path, method, requestParams }) => {
    expect(builder.build(`${method}:${path}`, requestParams)).toMatchSnapshot();
  });
});
