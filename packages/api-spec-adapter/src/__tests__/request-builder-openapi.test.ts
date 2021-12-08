import spec from './fixtures/petstore-spec';
import SwaggerSpecAdapter from '../adapter-swagger';
import { FetchParams } from '../types';

const actions: Array<{ path: string; method: string; fetchParams?: FetchParams; }> = [
  {
    path: '/pet',
    method: 'post',
    fetchParams: { body: { foo: 'bar' } },
  },
  {
    path: '/pet',
    method: 'put',
    fetchParams: { body: { foo: 'bar' } },
  },
  {
    path: '/pet/findByStatus',
    method: 'get',
    fetchParams: { params: { status: ['available', 'pending', 'sold'] } },
  },
  {
    path: '/pet/findByTags',
    method: 'get',
    fetchParams: { params: { tags: ['tag1', 'tag2', 'tag3'] } },
  },
  {
    path: '/pet/{petId}',
    method: 'get',
    fetchParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/pet/{petId}',
    method: 'post',
    fetchParams: { params: { petId: 'some_pet_id' }, body: { name: 'foo', status: 'alive' } },
  },
  {
    path: '/pet/{petId}',
    method: 'delete',
    fetchParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/pet/{petId}/uploadImage',
    method: 'post',
    fetchParams: { params: { petId: 'some_pet_id' } },
  },
  {
    path: '/store/inventory',
    method: 'get',
  },
  {
    path: '/store/order',
    method: 'post',
    fetchParams: { body: { foo: 'bar' } },
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
  const builder = new SwaggerSpecAdapter(spec);
  actions.forEach(({ path, method, fetchParams }) => {
    expect(builder.build(`${method}:${path}`, fetchParams)).toMatchSnapshot();
  });
});
