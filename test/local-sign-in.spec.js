const chai = require('chai');
const nock = require('nock');
const { getTestServer } = require('./test-server');

const userPayload = require('./payload/user');

chai.should();

nock.disableNetConnect();
nock.enableNetConnect(process.env.HOST_IP);

let requester;

describe('POST /local-sign-in', () => {
  before(async function () {
    if (
      process.env.TEST_ENV === 'FRONTEND'
    ) {
      this.skip();
    }

    requester = await getTestServer();
  });

  it('Calling POST /local-sign-in with valid credentials returns user data', async () => {
    nock(process.env.NEXT_PUBLIC_WRI_API_URL)
      .post(
        '/auth/login',
        { email: 'john@doe.com', password: '123456' },
      )
      .query({
        applications: 'rw', callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL, origin: 'rw', token: 'true',
      })
      .reply(200, { data: userPayload });

    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' });

    response.body.should.deep.equal(userPayload);
    response.status.should.equal(200);
  });

  it('Calling POST /local-sign-in with wrong credentials returns invalid login', async () => {
    nock(process.env.NEXT_PUBLIC_WRI_API_URL)
      .post('/auth/login', { email: 'john@doe.com', password: '123456' })
      .query({
        applications: 'rw',
        callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
        origin: 'rw',
        token: 'true',
      })
      .reply(401, { errors: [{ status: 401, detail: 'Invalid email or password' }] });

    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' });

    response.body.should.deep.equal({
      status: 'error',
      statusCode: 401,
      message: 'Invalid Login',
    });
    response.status.should.equal(401);
  });

  it('Calling POST /local-sign-in with credentials returns error', async () => {
    nock(process.env.NEXT_PUBLIC_WRI_API_URL)
      .post('/auth/login', { email: 'john@doe.com', password: '123456' })
      .query({
        applications: 'rw', callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL, origin: 'rw', token: 'true',
      })
      .reply(500, {
        errors: [{
          status: 500,
          detail: 'Database unavailable',
        }],
      });

    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' });

    response.status.should.equal(500);
    response.body.should.have.property('message').and.equal('There was an issue with the login. Please, try again later.');
  });

  afterEach(() => {
    if (!nock.isDone()) {
      throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
    }
  });
});
