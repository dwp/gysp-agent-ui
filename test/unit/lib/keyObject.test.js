const assert = require('assert');

const keyObject = require('../../../lib/keyObject');

const validDetails = {
  surname: 'Bloggs',
};

const agentRefObject = {
  cis: {
    surname: 'User',
    givenname: 'Test',
  },
};

const validJson = {
  surname: 'Bloggs',
  agentRef: 'Test User',
};

describe('Key object formatter', () => {
  it('should return valid json when object is called', (done) => {
    const json = keyObject.formatter(validDetails, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
});
