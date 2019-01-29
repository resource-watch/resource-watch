const { getTestAgent, closeTestAgent } = require('../server-agent');

let requester;

describe('App starts', () => {
  before(async () => { requester = await getTestAgent(); });

  it('Going to homepage should return a 200', async () => {
    const response = await requester.get('/').send();
    response.status.should.equal(200);
  });

  after(() => { closeTestAgent(); });
});
