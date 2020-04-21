const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../../app/routes/changes-enquiries/marital/functions');

const responseHelper = require('../../../lib/responseHelper');
const errorHelper = require('../../../lib/errorHelper');
const claimData = require('../../../lib/claimData');

let genericResponse = {};

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const ninoRequest = { session: { searchedNino: 'AA370773A' }, body: {} };
const marriedRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried() } };
const singleToMarriedRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'married' } } };
const singleToCivilRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'civil' } } };

const maritalDivorcedStatusRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'divorced' } } };

const emptyPostRequest = { session: { awardDetails: claimData.validClaimMarried() }, body: {} };
const validPostRequest = { session: { awardDetails: claimData.validClaimMarried() }, body: { maritalStatus: 'divorced' } };

const emptyDatePostRequest = { session: { awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'divorced' } }, body: {} };
const validDateAndStatusPostRequest = {
  session: { awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'divorced' } },
  body: {
    dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
  },
  flash: flashMock,
};
const validDatePostRequest = {
  session: { awardDetails: claimData.validClaimMarried() },
  body: {
    dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
  },
  flash: flashMock,
};

const validSingleToMarriedDateAndStatusPostRequest = {
  session: { awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'married' } },
  body: {
    dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
  },
  flash: flashMock,
};

const emptyNinoPostRequest = { session: { awardDetails: claimData.validClaimMarried() }, body: {} };
const validNinoPostRequest = {
  session: { awardDetails: claimData.validClaimMarried() },
  body: { partnerNino: 'AA123456C' },
  flash: flashMock,
};

const emptySpousePostRequest = {
  session: {
    awardDetails: claimData.validClaimSingle(),
    marital: {
      maritalStatus: 'married',
      date: {
        dateDay: '01', dateMonth: '01', dateYear: '2020', verification: 'V',
      },
    },
  },
  body: {},
};
const emptyPartnerPostRequest = JSON.parse(JSON.stringify(emptySpousePostRequest));
emptyPartnerPostRequest.session.marital.maritalStatus = 'civil';

const validSpousePostRequest = {
  session: {
    awardDetails: claimData.validClaimSingle(),
    marital: {
      maritalStatus: 'married',
      date: {
        dateDay: '01', dateMonth: '01', dateYear: '2020', verification: 'V',
      },
    },
  },
  body: {
    partnerNino: 'AA123456C',
    firstName: 'Joe',
    lastName: 'Bloggs',
    otherName: 'Middle',
    dobDay: '01',
    dobMonth: '02',
    dobYear: '1960',
  },
  flash: flashMock,
  originalUrl: '/changes-and-enquiries/marital-details/spouse-details',
};

const validPartnerPostRequest = {
  session: {
    awardDetails: claimData.validClaimSingle(),
    marital: {
      maritalStatus: 'civil',
      date: {
        dateDay: '01', dateMonth: '01', dateYear: '2020', verification: 'V',
      },
    },
  },
  body: {
    partnerNino: 'AA123456C',
    firstName: 'Joe',
    lastName: 'Bloggs',
    otherName: 'Middle',
    dobDay: '01',
    dobMonth: '02',
    dobYear: '1960',
  },
  flash: flashMock,
  originalUrl: '/changes-and-enquiries/marital-details/partner-details',
};

// API Endpoints
const changeCircumstancesDetailsUri = '/api/award';
const putMaritalDetailsApiUri = '/api/award/update-marital-details';

describe('Change circumstances - marital controller', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
  });

  describe('getMaritalDetails function (GET /changes-enquiries/marital)', () => {
    it('should return error view name when API returns a NOT_FOUND response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      assert.include(genericResponse.data.status, 'app:errors.api.not-found');
    });

    it('should return error view name when API returns a INTERNAL_SERVER_ERROR response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/{NINO}');
      assert.include(genericResponse.data.status, 'app:errors.api.internal-server-error');
    });

    it('should return view name and data when called nino exists in session and API return OK response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
      assert.isObject(genericResponse.data.keyDetails);
      assert.isObject(genericResponse.data.maritalDetails);
    });

    it('should return view name and data when award cached', async () => {
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
      assert.isObject(genericResponse.data.keyDetails);
      assert.isObject(genericResponse.data.maritalDetails);
    });
  });

  describe('getChangeMaritalStatus function (GET /changes-enquiries/marital-details/status)', () => {
    it('should return marital status view with married options when requested', () => {
      controller.getChangeMaritalStatus(marriedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/status');
      assert.lengthOf(genericResponse.data.newStatusOptions, 2);
      assert.equal(genericResponse.data.newStatusOptions[0].value, 'divorced');
      assert.equal(genericResponse.data.newStatusOptions[1].value, 'widowed');
      assert.isFalse(genericResponse.data.newStatusOptions[0].checked);
      assert.isFalse(genericResponse.data.newStatusOptions[1].checked);
    });

    it('should return marital status view with married options and option selected when requested', () => {
      controller.getChangeMaritalStatus(maritalDivorcedStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/status');
      assert.isTrue(genericResponse.data.newStatusOptions[0].checked);
      assert.isFalse(genericResponse.data.newStatusOptions[1].checked);
    });
  });

  describe('postChangeMaritalStatus function (POST /changes-enquiries/marital-details/status)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postChangeMaritalStatus(emptyPostRequest, genericResponse);
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/status');
    });

    it('should return redirect when called with valid post', () => {
      controller.postChangeMaritalStatus(validPostRequest, genericResponse);
      assert.deepEqual(validPostRequest.session.marital, { maritalStatus: 'divorced' });
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/date');
    });
  });

  describe('getChangeMaritalDate function (GET /changes-enquiries/marital-details/date)', () => {
    it('should return marital date view when requested', () => {
      controller.getChangeMaritalDate(maritalDivorcedStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/date');
      assert.equal(genericResponse.data.maritalStatus, 'divorced');
    });
  });

  describe('postChangeMaritalDate function (POST /changes-enquiries/marital-details/date)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postChangeMaritalDate(emptyDatePostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/date');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 5);
      assert.equal(genericResponse.data.maritalStatus, 'divorced');
      assert.deepEqual(genericResponse.data.details, {});
    });

    describe('partner details based on new status needed (married or civil partnership)', () => {
      it('should return a redirect to partner details when valid status present in session', async () => {
        controller.postChangeMaritalDate(validSingleToMarriedDateAndStatusPostRequest, genericResponse);
        assert.deepEqual(validSingleToMarriedDateAndStatusPostRequest.session.marital.date, validSingleToMarriedDateAndStatusPostRequest.body);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/spouse-details');
      });
    });

    describe('partner details not needed based on new status (divorced, dissolved, widowed)', () => {
      it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
        nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        await controller.postChangeMaritalDate(validDateAndStatusPostRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/date');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
      });

      it('should be return a redirect with BAD_REQUEST message', async () => {
        nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
        await controller.postChangeMaritalDate(validDateAndStatusPostRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/date');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
      });

      it('should be return a redirect with OK message and clear session when status had changed', async () => {
        nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
        await controller.postChangeMaritalDate(validDateAndStatusPostRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'marital-status:success-message');
        assert.isUndefined(validDateAndStatusPostRequest.session.marital);
      });

      it('should be return a redirect with OK message and clear session when status not present in session', async () => {
        nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
        await controller.postChangeMaritalDate(validDatePostRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'marital-date:success-message.married.verified');
        assert.isUndefined(validDatePostRequest.session.marital);
      });
    });
  });

  describe('getChangePartnerNino function (GET /changes-enquiries/marital-details/nino)', () => {
    it('should return nino view with empty partnerNino when requested', () => {
      controller.getChangePartnerNino(marriedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/nino');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.isUndefined(genericResponse.data.details);
    });
  });

  describe('postChangePartnerNino function (POST /changes-enquiries/marital-details/nino)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postChangePartnerNino(emptyNinoPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/nino');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postChangePartnerNino(validNinoPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/nino');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.postChangePartnerNino(validNinoPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/nino');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
      await controller.postChangePartnerNino(validNinoPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'marital-detail:married.fields.nino.success-message');
      assert.isUndefined(validNinoPostRequest.session.marital);
    });
  });

  describe('getPartnerDetails function (GET /changes-enquiries/marital-details/spouse-details)', () => {
    it('should return view when requested', () => {
      controller.getPartnerDetails(singleToMarriedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/partner');
      assert.equal(genericResponse.data.maritalStatus, 'married');
    });
  });

  describe('getPartnerDetails function (GET /changes-enquiries/marital-details/partner-details)', () => {
    it('should return view when requested', () => {
      controller.getPartnerDetails(singleToCivilRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/partner');
      assert.equal(genericResponse.data.maritalStatus, 'civil');
    });
  });

  describe('postPartnerDetails function (POST /changes-enquiries/marital-details/spouse-details)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postPartnerDetails(emptySpousePostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/partner');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 2);
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postPartnerDetails(validSpousePostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/spouse-details');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.postPartnerDetails(validSpousePostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/spouse-details');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
      await controller.postPartnerDetails(validSpousePostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'marital-status:success-message');
      assert.isUndefined(validSpousePostRequest.session.marital);
    });
  });

  describe('postPartnerDetails function (POST /changes-enquiries/marital-details/partner-details)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postPartnerDetails(emptyPartnerPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/partner');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 2);
      assert.equal(genericResponse.data.maritalStatus, 'civil');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postPartnerDetails(validPartnerPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/partner-details');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.postPartnerDetails(validPartnerPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/partner-details');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
      await controller.postPartnerDetails(validPartnerPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'marital-status:success-message');
      assert.isUndefined(validPartnerPostRequest.session.marital);
    });
  });
});
