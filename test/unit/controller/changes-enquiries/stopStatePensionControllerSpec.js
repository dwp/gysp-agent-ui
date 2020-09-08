const { assert } = require('chai');

const controller = require('../../../../app/routes/changes-enquiries/stop-state-pension/functions');

const claimData = require('../../../lib/claimData');
const responseHelper = require('../../../lib/responseHelper');

const awardDetails = { session: { awardDetails: claimData.validClaim() } };

let genericResponse;
let testPromise;

const getRequest = { ...awardDetails };

const getStopStatePensionResponse = {
  backLink: '/changes-and-enquiries/personal',
  formAction: '/changes-and-enquiries/personal/stop-state-pension',
};

const postRequestEmpty = { ...awardDetails, body: {} };

const postStopStatePensionRequestDeath = { ...awardDetails, body: { reason: 'death' } };

const postStopStatePensionRequestDeferral = { ...awardDetails, body: { reason: 'deferral' } };

describe('Stop State Pension controller', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();

    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30);
    });
  });

  describe('getStopStatePension function (GET /changes-and-enquiries/personal/stop-state-pension)', () => {
    it('should return correct data and page when requested', () => {
      controller.getStopStatePension(getRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getStopStatePensionResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/stop-state-pension/index');
    });
  });

  describe('postStopStatePension function (POST /changes-and-enquiries/personal/stop-state-pension)', () => {
    it('should return the same data and page, with an error, when requested with an empty form', () => {
      controller.postStopStatePension(postRequestEmpty, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/stop-state-pension/index');
      });
    });

    it('should save to session and redirect to the /death page', () => {
      controller.postStopStatePension(postStopStatePensionRequestDeath, genericResponse);
      return testPromise.then(() => {
        const session = postStopStatePensionRequestDeath.session['stop-state-pension'];
        assert.equal(session.reason, postStopStatePensionRequestDeath.body.reason);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death');
      });
    });

    it('should save to session and redirect to the /date-request-received page', () => {
      controller.postStopStatePension(postStopStatePensionRequestDeferral, genericResponse);
      return testPromise.then(() => {
        const { reason } = postStopStatePensionRequestDeath.session['stop-state-pension'];
        assert.equal(reason, postStopStatePensionRequestDeferral.body.reason);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/date-request-received');
      });
    });
  });
});
