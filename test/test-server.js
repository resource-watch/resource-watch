const chai = require('chai');
const chaiHttp = require('chai-http');

let requester;

chai.use(chaiHttp);

exports.getTestServer = async function getTestServer() {
  if (requester) {
    return requester;
  }

  // eslint-disable-next-line global-require
  const serverPromise = require('../server/app');
  const { httpListener } = await serverPromise();
  requester = chai.request(httpListener).keepOpen();

  return requester;
};
