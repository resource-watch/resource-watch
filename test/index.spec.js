const chai = require('chai');
const nock = require('nock');
const { getTestServer } = require('./test-server');

chai.should();

let requester;

describe('GET /data', () => {
  before(async () => {
    requester = await getTestServer();
  });

  it('Calling GET /data should redirect to ', async () => {
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
