const chai = require('chai');
const { getTestServer, closeTestServer } = require('../server-agent');

const should = chai.should();

let requester;

describe('App starts', () => {
  before(async () => {
    requester = await getTestServer();
  });

  it('Going to homepage should return a 200', async () => {
    const response = await requester.get('/').send();

    response.status.should.equal(200);
  });

  after(() => {
    closeTestServer();
  });

});
