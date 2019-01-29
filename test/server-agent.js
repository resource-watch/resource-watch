/* eslint-disable global-require */
const chai = require('chai');
const chaiHttp = require('chai-http');

let requester;

chai.use(chaiHttp);

exports.getTestServer = async function getTestAgent(forceNew = false) {
  if (forceNew && requester) {
    await new Promise((resolve) => {
      requester.close(() => {
        requester = null;
        resolve();
      });
    });
  }

  if (requester) {
    return requester;
  }

  const serverPromise = require('../index');
  const { server } = await serverPromise;
  requester = chai.request(server).keepOpen();

  return requester;
};

exports.closeTestServer = function closeTestAgent() {
  if (!requester) {
    return;
  }
  requester.close();
  requester = null;
};

