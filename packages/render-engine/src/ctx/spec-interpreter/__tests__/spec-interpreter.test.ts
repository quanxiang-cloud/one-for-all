import spec from './fixtures/petstore-spec';
import SpecInterpreter from '..';
import { RequestParams } from '../../../types';

const operations: Record<string, RequestParams> = {
  updatePet: {
    body: { foo: 'bar' },
  },
  addPet: {
    body: { foo: 'bar' },
  },
  findPetsByStatus: {

  },
  findPetsByTags: {

  },
  getPetById: {
    params: { petId: 'foobar' },
  },
  updatePetWithForm: {
    params: { petId: 'foobar' },
  },
  deletePet: {
    params: { petId: 'foobar' },
  },
  uploadFile: {
    params: { petId: 'foobar' },
  },
  getInventory: {

  },
  placeOrder: {

  },
  getOrderById: {
    params: { orderId: 'foobar' },
  },
  deleteOrder: {
    params: { orderId: 'foobar' },
  },
  createUser: {

  },
  createUsersWithListInput: {

  },
  loginUser: {

  },
  logoutUser: {

  },
  getUserByName: {
    params: { username: 'foobar' },
  },
  updateUser: {
    params: { username: 'foobar' },
  },
  deleteUser: {
    params: { username: 'foobar' },
  },
};

test('expect_specInterpreter_to_match_snapshots', () => {
  const builder = new SpecInterpreter(spec as any);
  Object.entries(operations).forEach(([operationId, params]) => {
    expect(builder.buildRequest(operationId, params)).toMatchSnapshot();
  });
});
