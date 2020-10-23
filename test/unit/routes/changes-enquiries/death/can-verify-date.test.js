const { assert } = require('chai');

const controller = require('../../../../../app/routes/changes-enquiries/death/can-verify-date/functions');

const claimData = require('../../../../lib/claimData');
const responseHelper = require('../../../../lib/responseHelper');

const fullUrl = { fullUrl: '/fake-url' };
const awardDetails = { awardDetails: claimData.validClaimWithDeathNotVerified() };
const details = { 'can-verify-date-of-death': { canVerify: 'yes' } };
const dateOfDeath = {
  dateDay: '01', dateMonth: '01', dateYear: '2019', verification: 'NV',
};

let genericResponse;

const getRequest = { session: { ...awardDetails }, ...fullUrl };
const getRequestWithDetails = { session: { ...awardDetails, ...details }, ...fullUrl };

const emptyPostRequest = { session: { ...awardDetails }, body: { }, ...fullUrl };
const validPostRequest = (value) => ({ session: { ...awardDetails }, body: { canVerify: value }, ...fullUrl });

describe('controller: death - canVerifyDate', () => {
  beforeEach(() => {
    genericResponse = {
      ...responseHelper.genericResponse(),
      locals: responseHelper.localResponse(this.genericResponse),
    };
  });

  describe('getCanVerifyDateOfDeath function (GET /changes-and-enquiries/personal/death/are-you-able-to-verify-the-date-of-death)', () => {
    it('should return view with blank form details', () => {
      controller.getCanVerifyDateOfDeath(getRequest, genericResponse);
      assert.isUndefined(genericResponse.data.details);
      assert.equal(genericResponse.data.backLink, '/changes-and-enquiries/personal');
      assert.equal(genericResponse.data.formAction, '/fake-url');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/can-verify-date');
    });

    it('should return view with completed form details', () => {
      controller.getCanVerifyDateOfDeath(getRequestWithDetails, genericResponse);
      assert.deepEqual(genericResponse.data.details, details['can-verify-date-of-death']);
      assert.equal(genericResponse.data.backLink, '/changes-and-enquiries/personal');
      assert.equal(genericResponse.data.formAction, '/fake-url');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/can-verify-date');
    });
  });

  describe('postCanVerifyDateOfDeath function (POST /changes-and-enquiries/personal/death/are-you-able-to-verify-the-date-of-death)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postCanVerifyDateOfDeath(emptyPostRequest, genericResponse);
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/can-verify-date');
    });

    it('should return redirect to verify date when called with valid yes post', () => {
      const request = validPostRequest('yes');
      controller.postCanVerifyDateOfDeath(request, genericResponse);
      assert.deepEqual(request.session.death['can-verify-date-of-death'], { canVerify: 'yes' });
      assert.equal(request.session.death.origin, 'canVerifyDateOfDeath');
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/verify');
    });

    it('should return redirect to dap name when called with valid no post', () => {
      const request = validPostRequest('no');
      controller.postCanVerifyDateOfDeath(request, genericResponse);
      assert.deepEqual(request.session.death['can-verify-date-of-death'], { canVerify: 'no' });
      assert.deepEqual(request.session.death['date-of-death'], dateOfDeath);
      assert.equal(request.session.death.origin, 'canVerifyDateOfDeath');
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/name');
    });
  });
});
