const assert = require('assert');

const claimInObject = require('../../../lib/claimInErrorObject');

const validDetails = {
  inviteKey: 'KEY',
  message: 'message',
};

const validJson = {
  inviteKey: 'KEY',
  errorDetail: 'message',
};

describe('Claim In object formatter', () => {
  it('should return valid json when object is called', (done) => {
    const json = claimInObject.formatter(validDetails);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
});
