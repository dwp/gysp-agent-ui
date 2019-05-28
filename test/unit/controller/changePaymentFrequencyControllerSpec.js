const { assert } = require('chai');

const controller = require('../../../app/routes/changes-enquiries/payment-frequency/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const paymentData = require('../../lib/paymentData');
const navigationData = require('../../lib/navigationData');

let testPromise;
let genericResponse = {};

const changePaymentFrequencyGetRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaim(),
  },
};
const changePaymentFrequencyViewData = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: null, dateOfBirth: null,
  },
  awardDetails: changePaymentFrequencyGetRequest.session.awardDetails,
  inputFrequency: false,
  secondaryNavigationList: navigationData.validNavigationPaymentSelected(),
};

const emptyPostRequest = { session: { awardDetails: claimData.validClaim(), paymentDetails: paymentData.validSchedule() }, body: {} };
const validPostSameFrequencyRequest = { session: { awardDetails: claimData.validClaim(), paymentDetails: paymentData.validSchedule(4) }, body: { frequency: '4W' } };
const validOneWeekPostDifferentFrequencyRequest = { session: { awardDetails: claimData.validClaim(), paymentDetails: paymentData.validSchedule(4) }, body: { frequency: '1W' } };
const validTwoWeekPostDifferentFrequencyRequest = { session: { awardDetails: claimData.validClaim(), paymentDetails: paymentData.validSchedule(4) }, body: { frequency: '2W' } };

describe('Change payment frequency controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };

    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30);
    });
  });

  describe(' getChangePaymentFrequency function (GET /changes-and-enquiries/payment/frequency)', () => {
    it('should display change bank or building account details page when requested', (done) => {
      controller.getChangePaymentFrequency(changePaymentFrequencyGetRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(changePaymentFrequencyViewData));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-frequency/index');
      done();
    });
  });

  describe(' postChangePaymentFrequency function (POST /changes-and-enquiries/payment/frequency)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postChangePaymentFrequency(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-frequency/index');
      });
    });

    it('should return a redirect to back payment page when post is a valid post and is same as current frequency', () => {
      controller.postChangePaymentFrequency(validPostSameFrequencyRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });

    it('should return a redirect to next page when post is a valid post and is different to current frequency - 1 week', () => {
      controller.postChangePaymentFrequency(validOneWeekPostDifferentFrequencyRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(JSON.stringify(validOneWeekPostDifferentFrequencyRequest.session['payment-frequency']), JSON.stringify({ frequency: '1W' }));
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency/schedule');
      });
    });

    it('should return a redirect to next page when post is a valid post and is different to current frequency - 2 week', () => {
      controller.postChangePaymentFrequency(validTwoWeekPostDifferentFrequencyRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(JSON.stringify(validTwoWeekPostDifferentFrequencyRequest.session['payment-frequency']), JSON.stringify({ frequency: '2W' }));
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency/schedule');
      });
    });
  });
});
