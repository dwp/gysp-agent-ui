const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

nock.disableNetConnect();

const controller = require('../../../../app/routes/changes-enquiries/marital/functions');

const responseHelper = require('../../../lib/responseHelper');
const errorHelper = require('../../../lib/errorHelper');
const claimData = require('../../../lib/claimData');
const dataObjects = require('../../../lib/reviewDataObjects');

let genericResponse = {};

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const emptyRequest = { session: { awardDetails: claimData.validClaimMarried() }, body: {} };

const statePensionUpdateTypes = ['new-state-pension', 'protected-payment', 'inherited-extra-state-pension'];

const ninoRequest = { session: { searchedNino: 'AA370773A' }, body: {} };
const marriedRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried() } };
const noSpouseDobRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.noSpouseDob() } };
const singleToMarriedRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'married' } } };
const singleToCivilRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'civil' } } };
const spouseDobVerifiedRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.spouseDobVerified() } };

const maritalDivorcedStatusRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'divorced' } } };

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

const validMarriedToWidowedDateAndStatusPostRequest = {
  session: { awardDetails: claimData.validClaimSingle(), marital: { maritalStatus: 'widowed' } },
  body: {
    dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
  },
  flash: flashMock,
};

const validNameRequest = (name) => ({
  session: { awardDetails: claimData.validClaimMarried() },
  body: { [name]: 'JoJo' },
  flash: flashMock,
});

const validDobPostRequest = {
  session: { awardDetails: claimData.validClaimMarried() },
  body: {
    dobDay: '01', dobMonth: '01', dobYear: '1980', dobVerified: 'V',
  },
  flash: flashMock,
};

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
  fullUrl: '/changes-and-enquiries/marital-details/spouse-details',
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
  fullUrl: '/changes-and-enquiries/marital-details/partner-details',
};

// Check for inheritable state pension requests
const checkForInheritableStatePensionRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed', 'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' } } }, fullUrl: '/test-url' };
const emptyCheckForInheritableStatePensionPostRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed' } }, fullUrl: '/test-url', body: { } };

// Consider state pension entitlement state pension requests
const considerStatePensionEntitlementRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed', 'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' } } }, fullUrl: '/test-url' };

// Save marital details requests
const saveMaritalDetailsRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed', 'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' } } }, fullUrl: '/changes-and-enquiries/marital-details/save-and-create-task' };
const saveMaritalDetailsPostRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      maritalStatus: 'widowed',
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
      'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' },
    },
  },
  fullUrl: '/changes-and-enquiries/marital-details/save-and-create-task',
  flash: flashMock,
};

// Entitled to inherited state pension requests
const entitledToInheritedStatePensionRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed', 'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'yes' } } }, fullUrl: '/test-url' };
const emptyEntitledToInheritedStatePensionPostRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed' } }, fullUrl: '/test-url', body: { } };

// RelevantInheritedAmounts requests
const relevantInheritedAmountsRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { 'relevant-inherited-amounts': { additionalPension: '5.45' } } }, fullUrl: '/test-url' };
const emptyRelevantInheritedAmountsPostRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { maritalStatus: 'widowed' } }, fullUrl: '/test-url', body: { } };

// UpdateStatePensionAward requests
const updateStatePensionAwardRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
    },
  },
  fullUrl: '/test-url',
  flash: flashMock,
};
const emptyUpdateStatePensionAwardPostRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
    },
  },
  fullUrl: '/test-url',
  flash: flashMock,
};
const validUpdateStatePensionAwardPostRequest = JSON.parse(JSON.stringify(emptyUpdateStatePensionAwardPostRequest));
validUpdateStatePensionAwardPostRequest.session.marital['update-state-pension-award-new-state-pension'] = { amount: '110.00' };


// UpdateStatePensionAwardAmount requests
const updateStatePensionAwardAmountWithoutDetailsRequest = (type) => ({ params: { type }, session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { } }, fullUrl: '/test-url' });
const updateStatePensionAwardAmountWithDetailsRequest = (type) => ({ params: { type }, session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { [`update-state-pension-award-${type}`]: { amount: '5.45' } } }, fullUrl: '/test-url' });
const emptyUpdateStatePensionAwardAmountPostRequest = (type) => ({
  params: { type },
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
      '2020-01-01:2018-11-09:73': { entitlementDate: 1546300800000 },
    },
  },
  fullUrl: '/test-url',
  body: { },
  flash: flashMock,
});

// UpdateAndSendLetter requests
const updateAndSendLetterRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      'update-state-pension-award': { entitlementDate: 1580968800000 },
    },
  },
  fullUrl: '/test-url',
};
const updateAndSendLetterPostRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      maritalStatus: 'widowed',
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
      'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' },
      'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'yes' },
    },
  },
  fullUrl: '/changes-and-enquiries/marital-details/update-and-send-letter',
  flash: flashMock,
};

// SendLetter requests
const sendLetterRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaimMarried(), marital: { } }, fullUrl: '/test-url' };
const sendLetterPostRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaimMarried(),
    marital: {
      maritalStatus: 'widowed',
      date: {
        dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
      },
      'check-for-inheritable-state-pension': { checkInheritableStatePension: 'yes' },
      'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'no' },
    },
  },
  fullUrl: '/changes-and-enquiries/marital-details/send-letter',
  flash: flashMock,
};

// API Endpoints
const awardReviewBreakdownUri = '/api/award/srbpaymentbreakdown';
const changeCircumstancesDetailsUri = '/api/award';
const putMaritalDetailsApiUri = '/api/award/update-marital-details';
const putUpdateWidowDetails = '/api/award/update-widow-details';
const getEntitlementDateApiUri = (entitlementDate, claimFromDate, ninoDigits) => `/api/award/entitlement-date?entitlementDate=${entitlementDate}&claimFromDate=${claimFromDate}&ninoDigits=${ninoDigits}`;
const getValidateNspApiUri = (entitlementDate, amount) => `/api/paymentcalc/validatensp?entitlement-date=${entitlementDate}&amount=${amount}`;

describe('Change circumstances - marital controller', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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
      assert.include(genericResponse.data.status, 'There has been a problem - award not found. This has been logged.');
    });

    it('should return error view name when API returns a INTERNAL_SERVER_ERROR response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/{NINO}');
      assert.include(genericResponse.data.status, 'There has been a problem with the service, please try again. This has been logged.');
    });

    it('should return view name and data when called nino exists in session and API return OK response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
      assert.isObject(genericResponse.data.maritalDetails);
    });

    it('should return view name and data when award cached', async () => {
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
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
      controller.postChangeMaritalStatus(emptyRequest, genericResponse);
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

    describe('partner details not needed based on new status (divorced, dissolved)', () => {
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
        assert.equal(flash.message, 'Marital status changed');
        assert.isUndefined(validDateAndStatusPostRequest.session.marital);
      });

      it('should be return a redirect with OK message and clear session when status not present in session', async () => {
        nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
        await controller.postChangeMaritalDate(validDatePostRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Date of marriage verified');
        assert.isUndefined(validDatePostRequest.session.marital);
      });
    });

    describe('should continue to collect more data when customer is widowed and widow feature enabled', () => {
      it('should return a redirect to partner details when valid status present in session', async () => {
        const widowFeatureResponse = { ...genericResponse };
        widowFeatureResponse.locals.widowInheritanceFeature = true;
        controller.postChangeMaritalDate(validMarriedToWidowedDateAndStatusPostRequest, widowFeatureResponse);
        assert.deepEqual(validMarriedToWidowedDateAndStatusPostRequest.session.marital.date, validMarriedToWidowedDateAndStatusPostRequest.body);
        assert.equal(widowFeatureResponse.address, '/changes-and-enquiries/marital-details/check-for-inheritable-state-pension');
      });
    });
  });

  describe('...changeName', () => {
    ['first-name', 'last-name'].forEach((name) => {
      context(name, () => {
        describe(`getChangeName function (GET /changes-enquiries/marital-details/${name}`, () => {
          it(`should return ${name} view with empty ${name} field when requested`, () => {
            controller.getChangeName(name)(marriedRequest, genericResponse);
            assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/name');
            assert.equal(genericResponse.data.backHref, '/marital-details');
            assert.equal(genericResponse.data.maritalStatus, 'married');
            assert.equal(genericResponse.data.name, name);
            assert.isUndefined(genericResponse.data.details);
          });
        });

        describe(`postChangeName function (POST /changes-enquiries/marital-details/${name}`, () => {
          it('should return view name with errors when called with empty post', () => {
            controller.postChangeName(name)(emptyRequest, genericResponse);
            assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/name');
            assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
            assert.equal(genericResponse.data.backHref, '/marital-details');
            assert.equal(genericResponse.data.maritalStatus, 'married');
            assert.equal(genericResponse.data.name, name);
            assert.deepEqual(genericResponse.data.details, {});
          });

          it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
            nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
            await controller.postChangeName(name)(validNameRequest(name), genericResponse);
            assert.equal(genericResponse.address, `/changes-and-enquiries/marital-details/${name}`);
            assert.equal(flash.type, 'error');
            assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
            assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
          });

          it('should be return a redirect with BAD_REQUEST message', async () => {
            nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
            await controller.postChangeName(name)(validNameRequest(name), genericResponse);
            assert.equal(genericResponse.address, `/changes-and-enquiries/marital-details/${name}`);
            assert.equal(flash.type, 'error');
            assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
            assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
          });

          it('should be return a redirect with OK message and clear session', async () => {
            nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
            const validNameRequestObject = validNameRequest(name);
            await controller.postChangeName(name)(validNameRequestObject, genericResponse);
            assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
            assert.equal(flash.type, 'success');
            assert.equal(flash.message, 'Spouse details updated');
            assert.isUndefined(validNameRequestObject.session.marital);
          });
        });
      });
    });
  });

  describe('getPartnerDateOfBirth function (GET /changes-enquiries/marital-details/date-of-birth)', () => {
    it('should return dob view with empty date of birth when requested', () => {
      controller.getPartnerDateOfBirth(noSpouseDobRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/dob');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {
        dobDay: '', dobMonth: '', dobYear: '',
      });
    });

    it('should return dob view with populated date of birth when requested', () => {
      controller.getPartnerDateOfBirth(spouseDobVerifiedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/dob');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {
        dobDay: '19', dobMonth: '3', dobYear: '1952',
      });
    });
  });

  describe('postPartnerDateOfBirth function (POST /changes-enquiries/marital-details/date-of-birth)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postPartnerDateOfBirth(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/dob');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 5);
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postPartnerDateOfBirth(validDobPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/date-of-birth');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.postPartnerDateOfBirth(validDobPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/date-of-birth');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-marital-details');
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putMaritalDetailsApiUri).reply(httpStatus.OK, {});
      await controller.postPartnerDateOfBirth(validDobPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'Spouse details updated');
      assert.isUndefined(validNinoPostRequest.session.marital);
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
      controller.postChangePartnerNino(emptyRequest, genericResponse);
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
      assert.equal(flash.message, 'Spouse details updated');
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
      assert.equal(flash.message, 'Marital status changed');
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
      assert.equal(flash.message, 'Marital status changed');
      assert.isUndefined(validPartnerPostRequest.session.marital);
    });
  });

  describe('getCheckForInheritableStatePension function (GET /changes-enquiries/marital-details/check-for-inheritable-state-pension)', () => {
    it('should return view when requested', () => {
      controller.getCheckForInheritableStatePension(checkForInheritableStatePensionRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/check-for-inheritable-state-pension');
      assert.equal(genericResponse.data.backHref, '/marital-details/date');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, checkForInheritableStatePensionRequest.session.marital['check-for-inheritable-state-pension']);
    });
  });

  describe('postCheckForInheritableStatePension function (POST /changes-enquiries/marital-details/check-for-inheritable-state-pension)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postCheckForInheritableStatePension(emptyCheckForInheritableStatePensionPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/check-for-inheritable-state-pension');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.data.backHref, '/marital-details/date');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should return a redirect to consider state pension entitlement when answer to check Inheritable State Pension is yes', () => {
      controller.postCheckForInheritableStatePension({ ...emptyCheckForInheritableStatePensionPostRequest, body: { checkInheritableStatePension: 'yes' } }, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/consider-state-pension-entitlement');
      assert.equal(emptyCheckForInheritableStatePensionPostRequest.session.marital['check-for-inheritable-state-pension'].checkInheritableStatePension, 'yes');
    });

    it('should return a redirect to save and create task when answer to check Inheritable State Pension is no', () => {
      controller.postCheckForInheritableStatePension({ ...emptyCheckForInheritableStatePensionPostRequest, body: { checkInheritableStatePension: 'no' } }, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/save-and-create-task');
      assert.equal(emptyCheckForInheritableStatePensionPostRequest.session.marital['check-for-inheritable-state-pension'].checkInheritableStatePension, 'no');
    });
  });

  describe('getConsiderStatePensionEntitlement function (GET /changes-enquiries/marital-details/consider-state-pension-entitlement)', () => {
    it('should return view name with data', () => {
      controller.getConsiderStatePensionEntitlement(considerStatePensionEntitlementRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/state-pension-entitlement');
      assert.equal(genericResponse.data.backHref, '/marital-details/check-for-inheritable-state-pension');
      assert.equal(genericResponse.data.nextPageHref, '/marital-details/entitled-to-any-inherited-state-pension');
      assert.isObject(genericResponse.data.details);
    });
  });

  describe('getSaveMaritalDetails function (GET /changes-enquiries/marital-details/save-and-create-task)', () => {
    it('should return view name with data', () => {
      controller.getSaveMaritalDetails(saveMaritalDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/save-and-create-task');
      assert.equal(genericResponse.data.backHref, '/marital-details/check-for-inheritable-state-pension');
    });
  });

  describe('postSaveMaritalDetails function (POST /changes-enquiries/marital-details/save-and-create-task)', () => {
    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postSaveMaritalDetails(saveMaritalDetailsPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/save-and-create-task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.BAD_REQUEST, {});
      await controller.postSaveMaritalDetails(saveMaritalDetailsPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/save-and-create-task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.OK, {});
      await controller.postSaveMaritalDetails(saveMaritalDetailsPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'Marital status changed');
      assert.isUndefined(saveMaritalDetailsPostRequest.session.marital);
    });
  });

  describe('getEntitledToInheritedStatePension function (GET /changes-enquiries/marital-details/entitled-to-any-inherited-state-pension)', () => {
    it('should return view when requested', () => {
      controller.getEntitledToInheritedStatePension(entitledToInheritedStatePensionRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/entitled-to-inherited-state-pension');
      assert.equal(genericResponse.data.backHref, '/marital-details/consider-state-pension-entitlement');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, entitledToInheritedStatePensionRequest.session.marital['entitled-to-inherited-state-pension']);
    });
  });

  describe('postEntitledToInheritedStatePension function (POST /changes-enquiries/marital-details/entitled-to-any-inherited-state-pension)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postEntitledToInheritedStatePension(emptyEntitledToInheritedStatePensionPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/entitled-to-inherited-state-pension');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.data.backHref, '/marital-details/consider-state-pension-entitlement');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should return a redirect to yes answer when answer to check Inheritable State Pension is yes', () => {
      controller.postEntitledToInheritedStatePension({ ...emptyEntitledToInheritedStatePensionPostRequest, body: { entitledInheritableStatePension: 'yes' } }, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
      assert.equal(emptyEntitledToInheritedStatePensionPostRequest.session.marital['entitled-to-inherited-state-pension'].entitledInheritableStatePension, 'yes');
    });

    it('should return a redirect to save and create task when answer to check Inheritable State Pension is no', () => {
      controller.postEntitledToInheritedStatePension({ ...emptyEntitledToInheritedStatePensionPostRequest, body: { entitledInheritableStatePension: 'no' } }, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/send-letter');
      assert.equal(emptyEntitledToInheritedStatePensionPostRequest.session.marital['entitled-to-inherited-state-pension'].entitledInheritableStatePension, 'no');
    });
  });

  describe('getRelevantInheritedAmounts function (GET /changes-enquiries/marital-details/relevant-inherited-amounts)', () => {
    it('should return view when requested', () => {
      controller.getRelevantInheritedAmounts(relevantInheritedAmountsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/relevant-inherited-amounts');
      assert.equal(genericResponse.data.backHref, '/marital-details/entitled-to-any-inherited-state-pension');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, relevantInheritedAmountsRequest.session.marital['relevant-inherited-amounts']);
    });
  });

  describe('postRelevantInheritedAmounts function (POST /changes-enquiries/marital-details/relevant-inherited-amounts)', () => {
    it('should return view name with errors when called with empty post', () => {
      controller.postRelevantInheritedAmounts(emptyRelevantInheritedAmountsPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/relevant-inherited-amounts');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.data.backHref, '/marital-details/entitled-to-any-inherited-state-pension');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.deepEqual(genericResponse.data.details, {});
    });

    it('should return a redirect to update state pension award when pass validation ', () => {
      controller.postRelevantInheritedAmounts({ ...emptyRelevantInheritedAmountsPostRequest, body: { additionalPension: '100.44' } }, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-state-pension-award');
      assert.equal(emptyRelevantInheritedAmountsPostRequest.session.marital['relevant-inherited-amounts'].additionalPension, '100.44');
    });
  });

  describe('getUpdateStatePensionAward function (GET /changes-enquiries/marital-details/update-state-pension-award)', () => {
    const getEntitlementDateUri = getEntitlementDateApiUri('2020-01-01', '2018-11-09', '73');
    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getUpdateStatePensionAward(updateStatePensionAwardRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${getEntitlementDateUri}`);
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.getUpdateStatePensionAward(updateStatePensionAwardRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${getEntitlementDateUri}`);
    });

    it('should be return a view with api date when OK message from API', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.OK, { entitlementDate: 1580968800000 });
      await controller.getUpdateStatePensionAward(updateStatePensionAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/update-state-pension-award');
      assert.equal(genericResponse.data.backHref, '/marital-details/relevant-inherited-amounts');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.isObject(genericResponse.data.details);
    });

    it('should be return a view cached api date', async () => {
      await controller.getUpdateStatePensionAward(updateStatePensionAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/update-state-pension-award');
      assert.equal(genericResponse.data.backHref, '/marital-details/relevant-inherited-amounts');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.isObject(genericResponse.data.details);
    });
  });

  describe('postUpdateStatePensionAward function (GET /changes-enquiries/marital-details/update-state-pension-award)', () => {
    const getEntitlementDateUri = getEntitlementDateApiUri('2020-01-01', '2018-11-09', '73');
    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postUpdateStatePensionAward(emptyUpdateStatePensionAwardPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${getEntitlementDateUri}`);
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.postUpdateStatePensionAward(emptyUpdateStatePensionAwardPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${getEntitlementDateUri}`);
    });

    it('should return view when requested with errors with empty post and call API', async () => {
      nock('http://test-url/').get(getEntitlementDateUri).reply(httpStatus.OK, { entitlementDate: 1580968800000 });
      await controller.postUpdateStatePensionAward(emptyUpdateStatePensionAwardPostRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'common/marital/update-state-pension-award');
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.data.backHref, '/marital-details/relevant-inherited-amounts');
      assert.equal(genericResponse.data.formUrl, '/test-url');
      assert.isObject(genericResponse.data.details);
    });

    it('should return redirect when validation has passed', async () => {
      await controller.postUpdateStatePensionAward(validUpdateStatePensionAwardPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-and-send-letter');
    });
  });

  describe('getUpdateStatePensionAwardAmount function (GET /changes-enquiries/marital-details/update-state-pension-award-TYPE)', () => {
    statePensionUpdateTypes.forEach((type) => {
      context(`TYPE: ${type}`, () => {
        it('should return view when requested with details', () => {
          const request = updateStatePensionAwardAmountWithDetailsRequest(type);
          controller.getUpdateStatePensionAwardAmount(request, genericResponse);
          assert.equal(genericResponse.viewName, 'common/marital/update-award-amount');
          assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
          assert.equal(genericResponse.data.formUrl, '/test-url');
          assert.deepEqual(genericResponse.data.details, request.session.marital[`update-state-pension-award-${type}`]);
        });

        it('should return view when requested without details', () => {
          const request = updateStatePensionAwardAmountWithoutDetailsRequest(type);
          controller.getUpdateStatePensionAwardAmount(request, genericResponse);
          assert.equal(genericResponse.viewName, 'common/marital/update-award-amount');
          assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
          assert.equal(genericResponse.data.formUrl, '/test-url');
          assert.isUndefined(genericResponse.data.details);
        });
      });
    });
  });

  describe('postUpdateStatePensionAwardAmount function (POST /changes-enquiries/marital-details/update-state-pension-award-TYPE)', () => {
    context('new-state-pension', () => {
      it('should return view when requested with errors with empty post', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('new-state-pension');
        await controller.postUpdateStatePensionAwardAmount(request, genericResponse);
        assert.equal(genericResponse.viewName, 'common/marital/update-award-amount');
        assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
        assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
        assert.equal(genericResponse.data.formUrl, '/test-url');
        assert.deepEqual(genericResponse.data.details, {});
      });

      it('should return a redirect with INTERNAL_SERVER_ERROR flash message message', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('new-state-pension');
        const endpoint = getValidateNspApiUri('2019-01-01', '100.44');
        nock('http://test-url/').get(endpoint).reply(httpStatus.INTERNAL_SERVER_ERROR, { });
        await controller.postUpdateStatePensionAwardAmount({ ...request, body: { amount: '100.44' } }, genericResponse);
        assert.equal(genericResponse.address, '/test-url');
        assert.isUndefined(request.session.marital['update-state-pension-award-new-state-pension']);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
        assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${endpoint}`);
      });

      it('should return a redirect with BAD_REQUEST flash message message', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('new-state-pension');
        const endpoint = getValidateNspApiUri('2019-01-01', '100.44');
        nock('http://test-url/').get(endpoint).reply(httpStatus.BAD_REQUEST, { });
        await controller.postUpdateStatePensionAwardAmount({ ...request, body: { amount: '100.44' } }, genericResponse);
        assert.equal(genericResponse.address, '/test-url');
        assert.isUndefined(request.session.marital['update-state-pension-award-new-state-pension']);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
        assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${endpoint}`);
      });

      it('should return a redirect to update state pension award when validation is passed', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('new-state-pension');
        nock('http://test-url/').get(getValidateNspApiUri('2019-01-01', '100.44')).reply(httpStatus.OK, { valid: true, validation: { max: 0 } });
        await controller.postUpdateStatePensionAwardAmount({ ...request, body: { amount: '100.44' } }, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-state-pension-award');
        assert.equal(request.session.marital['update-state-pension-award-new-state-pension'].amount, '100.44');
      });
    });

    context('protected-payment', () => {
      it('should return view when requested with errors with empty post', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('protected-payment');
        await controller.postUpdateStatePensionAwardAmount(request, genericResponse);
        assert.equal(genericResponse.viewName, 'common/marital/update-award-amount');
        assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
        assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
        assert.equal(genericResponse.data.formUrl, '/test-url');
        assert.deepEqual(genericResponse.data.details, {});
      });

      it('should return a redirect to update state pension award when validation is passed', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('protected-payment');
        await controller.postUpdateStatePensionAwardAmount({ ...request, body: { amount: '100.44' } }, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-state-pension-award');
        assert.equal(request.session.marital['update-state-pension-award-protected-payment'].amount, '100.44');
      });
    });

    context('inherited-extra-state-pension', () => {
      it('should return view when requested with errors with empty post', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('inherited-extra-state-pension');
        await controller.postUpdateStatePensionAwardAmount(request, genericResponse);
        assert.equal(genericResponse.viewName, 'common/marital/update-award-amount');
        assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
        assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
        assert.equal(genericResponse.data.formUrl, '/test-url');
        assert.deepEqual(genericResponse.data.details, {});
      });

      it('should return a redirect to update state pension award when validation is passed', async () => {
        const request = emptyUpdateStatePensionAwardAmountPostRequest('inherited-extra-state-pension');
        await controller.postUpdateStatePensionAwardAmount({ ...request, body: { amount: '130.44' } }, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-state-pension-award');
        assert.equal(request.session.marital['update-state-pension-award-inherited-extra-state-pension'].amount, '130.44');
      });
    });
  });

  describe('getUpdateAndSendLetter function (GET /changes-enquiries/marital-details/update-and-send-letter)', () => {
    const query = {
      inviteKey: 'BLOG123456',
      spAmount: 100,
      protectedAmount: 10,
      inheritedExtraSpAmount: 0,
      entitlementDate: '2020-02-06',
    };

    it('should return view with data when a 200 response from the API is received', async () => {
      nock('http://test-url').get(awardReviewBreakdownUri).query(query).reply(200, dataObjects.validPaymentApiResponse());

      await controller.getUpdateAndSendLetter(updateAndSendLetterRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/update-and-send-letter');
      assert.equal(genericResponse.data.backHref, '/marital-details/update-state-pension-award');
      assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validPaymentFormattedObject()));
      assert.equal(genericResponse.data.formUrl, '/test-url');
    });

    it('should return error view when API returns 404 state', async () => {
      nock('http://test-url').get(awardReviewBreakdownUri).query(query).reply(httpStatus.NOT_FOUND, {});

      await controller.getUpdateAndSendLetter(updateAndSendLetterRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Payment breakdown not found.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/award/srbpaymentbreakdown?inviteKey=BLOG123456&spAmount=100&protectedAmount=10&inheritedExtraSpAmount=0&entitlementDate=2020-02-06');
    });

    it('should return error view when API returns 500 state', async () => {
      nock('http://test-url').get(awardReviewBreakdownUri).query(query).reply(httpStatus.INTERNAL_SERVER_ERROR, {});

      await controller.getUpdateAndSendLetter(updateAndSendLetterRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Issue getting payment breakdown.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/srbpaymentbreakdown?inviteKey=BLOG123456&spAmount=100&protectedAmount=10&inheritedExtraSpAmount=0&entitlementDate=2020-02-06');
    });
  });

  describe('postUpdateAndSendLetter function (POST /changes-and-enquiries/marital-details/update-and-send-letter)', () => {
    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postUpdateAndSendLetter(updateAndSendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-and-send-letter');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.BAD_REQUEST, {});
      await controller.postUpdateAndSendLetter(updateAndSendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/update-and-send-letter');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.OK, {});
      await controller.postUpdateAndSendLetter(updateAndSendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'Marital status changed - award updated');
      assert.isUndefined(updateAndSendLetterPostRequest.session.marital);
    });
  });

  describe('getSendLetter function (GET /changes-enquiries/marital-details/send-letter)', () => {
    it('should return view when requested with details', () => {
      controller.getSendLetter(sendLetterRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/send-letter');
      assert.equal(genericResponse.data.backHref, '/marital-details/entitled-to-any-inherited-state-pension');
      assert.equal(genericResponse.data.formUrl, '/test-url');
    });
  });

  describe('postSendLetter function (POST /changes-and-enquiries/marital-details/send-letter)', () => {
    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postSendLetter(sendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/send-letter');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.BAD_REQUEST, {});
      await controller.postSendLetter(sendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/marital-details/send-letter');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${putUpdateWidowDetails}`);
    });

    it('should be return a redirect with OK message and clear session', async () => {
      nock('http://test-url/').put(putUpdateWidowDetails).reply(httpStatus.OK, {});
      await controller.postSendLetter(sendLetterPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'Marital status changed - no change to award');
      assert.isUndefined(sendLetterPostRequest.session.marital);
    });
  });
});
