const { assert } = require('chai');
const domain = require('../../../lib/urlExtract');

describe('domain extract', () => {
  it('save should equal local host when supplied with http link', () => {
    assert.equal(domain.extract('http://localhost/'), 'localhost');
  });

  it('save should equal local host when supplied with https link', () => {
    assert.equal(domain.extract('https://localhost/'), 'localhost');
  });

  it('save should equal local host when supplied with no http link', () => {
    assert.equal(domain.extract('localhost'), 'localhost');
  });

  it('should return empty string when nothing is passed', () => {
    assert.equal(domain.extract(), undefined);
  });
});
