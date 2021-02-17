const { cloneObject } = require('./unitHelper.js');

const tokenPayload = {
  sid: 'cb9c1a5b-6910-fb2f-957a-9c72a392d90d',
  exp: new Date().getTime() + 86400000,
  cis: {
    dwp_staffid: '123456789',
    surname: 'User',
    givenname: 'Test',
  },
  sub: 'NOT_FOUND',
  iss: 'dwp-adfs',
  aud: 'ROLE_GYSP-TEST-OPS-PROCESSOR',
  username: 'Test',
  iat: 1498060266,
};

const gbSloc = '104815';
const northenIrelandSloc = '107886';

module.exports = (northIreland = false) => {
  tokenPayload.cis.SLOC = northIreland ? northenIrelandSloc : gbSloc;
  return {
    user: {
      ...cloneObject(tokenPayload),
    },
  };
};
