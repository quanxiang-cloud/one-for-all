import spec from './petstore-spec';
import Builder from '../src/index';

const operations: Record<string, RequestBuilder.RequestParams> = {
  updatePet: {
    body: {}
  },
  addPet: {
    body: {}
  },
  findPetsByStatus: {

  },
  findPetsByTags: {

  },
  getPetById: {
    params: { petId: 'foobar' }
  },
  updatePetWithForm: {
    params: { petId: 'foobar' }
  },
  deletePet: {
    params: { petId: 'foobar' }
  },
  uploadFile: {
    params: { petId: 'foobar' }
  },
  getInventory: {

  },
  placeOrder: {

  },
  getOrderById: {
    params: { orderId: 'foobar' }
  },
  deleteOrder: {
    params: { orderId: 'foobar' }
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
    params: { username: 'foobar' }
  },
  updateUser: {
    params: { username: 'foobar' }
  },
  deleteUser: {
    params: { username: 'foobar' }
  },
}

test('expect to match snapshots', () => {
  const builder = new Builder(spec as any);
  Object.entries(operations).forEach(([operationId, params]) => {
    expect(builder.fillRequest(operationId, params)).toMatchSnapshot();
  })
})
