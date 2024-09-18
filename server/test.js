var request = require('supertest');

describe('loading express', () => {
  var server;
  beforeEach(function () {
    server = require('./index');
  });
  it('Server is Running', async () =>  {
    const response = await request(server)
      .get('/')
      .expect(200);
  });
});

describe('Endpoints are accessible to only authorized users', async => {
  var server;
  beforeEach(function () {
    server = require('./index');
  });
  it('responds 401 to /generateQR with wrong JWT', async () =>  {
    const jwt = 'dummyJWT';
    const payload = {meetindId: '123', userId: 'test@test.com'}
    const response = await request(server)
      .post('/api/qr/generateQR')
      .send(payload)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(401);
  });
});