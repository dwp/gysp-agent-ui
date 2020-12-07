const assert = require('assert');

const keyObject = require('../../../lib/keyObject');

const validDetails = {
  surname: 'Bloggs',
};

const agentRefObject = {
  cis: {
    surname: 'User',
    givenname: 'Test',
    dwp_staffid: '12345678',
  },
};

const validJson = {
  surname: 'Bloggs',
  agentRef: '12345678',
};

describe('Key object formatter', () => {
  it('should return valid json when object is called', (done) => {
    const json = keyObject.formatter(validDetails, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
});
