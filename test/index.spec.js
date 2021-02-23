const chai = require('chai');
const nock = require('nock');
const { getTestServer } = require('./test-server');

const userPayload = require('./payload/user');

chai.should();

// nock.disableNetConnect();
// nock.enableNetConnect(process.env.HOST_IP);

let requester;

describe('POST /local-sign-in', () => {
  before(async () => {
    // nock.recorder.rec();
    requester = await getTestServer();
  });

  it('Calling POST /local-sign-in with valid credentials returns user data', async () => {
    nock('https://api.resourcewatch.org:443', {"encodedQueryParams":true})
      .post('/auth/login', {"email":"john@doe.com","password":"123456"})
      .query({"applications":"rw","callbackUrl":"http://localhost:9000/auth","origin":"rw","token":"true"})
      .reply(200, { "data": userPayload });

    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' });

      response.body.should.deep.equal(userPayload);
      response.status.should.equal(200);
  });

  it('Calling POST /local-sign-in with wrong wrong credentials returns invalid login', async () => {
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
    nock('https://api.resourcewatch.org:443', {"encodedQueryParams":true})
      .post('/auth/login', {"email":"john@doe.com","password":"123456"})
      .query({"applications":"rw","callbackUrl":"http://localhost:9000/auth","origin":"rw","token":"true"})
      .reply(500, {
        errors: [{
          detail: "Database unavailable",
        }]
      });
    const response = await requester
      .post('/local-sign-in')
      .send({ email: 'john@doe.com', password: '123456' })

      response.status.should.equal(500);
      response.body.should.have.property('message').and.equal('There was an issue with the login. Please, try again later.');
  });

    afterEach(() => {
      if (!nock.isDone()) {
        throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
      }
  });
});

describe('GET /data', () => {
  before(async () => {
    requester = await getTestServer();
  });

  it('Calling GET /data should redirect to /data/explore', async () => {
    const response = await requester
      .get('/data')
      .redirects(0);

    response.status.should.equal(302);
    response.should.redirectTo('/data/explore');
  });

  afterEach(() => {
    if (!nock.isDone()) {
      const pendingMocks = nock.pendingMocks();
      if (pendingMocks.length > 1) {
        throw new Error(`Not all nock interceptors were used: ${pendingMocks}`);
      }
    }
  });
});
