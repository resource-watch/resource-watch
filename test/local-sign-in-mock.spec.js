const chai = require('chai');
const nock = require('nock');
const { getTestServer } = require('./test-server');

const userPayload = require('./payload/user');

chai.should();

nock.disableNetConnect();
nock.enableNetConnect(process.env.HOST_IP);

let requester;

describe('POST /local-sign-in (mocked version)', () => {
  before(async function () {
    if (
      process.env.NODE_ENV !== 'TEST_FRONTEND'
    ) {
      this.skip();
    }

    requester = await getTestServer();
  });

  it('Calling POST /local-sign-in (mocked) returns user data', async () => {
    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' });

    response.status.should.equal(200);
    response.body.should.deep.equal(userPayload);
  });

  afterEach(() => {
    if (!nock.isDone()) {
      throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
    }
  });
});
