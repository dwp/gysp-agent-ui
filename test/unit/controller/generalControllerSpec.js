const { assert } = require('chai');

const generalController = require('../../../app/routes/general/functions');
const responseHelper = require('../../lib/responseHelper');

let genericResponse = {};
const emptyRequest = { session: {} };

describe('General controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
  });

  describe('landingPage function (GET /)', () => {
    it('should return landing page view', (done) => {
      generalController.landingPage(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/landing');
      done();
    });
  });

  describe('accessibilityStatement function (GET /accessibility-statement)', () => {
    it('should return accessibility statement page view', (done) => {
      generalController.accessibilityStatement(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/accessibility-statement');
      done();
    });
  });
});
