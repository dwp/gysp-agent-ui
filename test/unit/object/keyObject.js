const assert = require('assert');

const keyObject = require('../../../lib/keyObject');

const validDetails = {
  surname: 'Bloggs',
};

const agentRefObject = {
  username: 'fake@fake.com',
};

const validJson = {
  surname: 'Bloggs',
  agentRef: 'fake@fake.com',
};

describe('Key object formatter', () => {
  it('should return valid json when object is called', (done) => {
    const json = keyObject.formatter(validDetails, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
});
