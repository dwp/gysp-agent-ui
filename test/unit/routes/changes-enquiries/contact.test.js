const assert = require('assert');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

nock.disableNetConnect();

const changeContactDetailsController = require('../../../../app/routes/changes-enquiries/contact/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const { promiseWait } = require('../../../lib/unitHelper');
const kongData = require('../../../lib/kongData');
const requestKongHeaderData = require('../../../lib/requestKongHeaderData');

let testPromise;
let genericResponse = {};

// Mocks
let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const contactDetailsRequest = { session: { searchedNino: 'AA370773A' }, body: {} };

const homePhoneAddRequest = { params: { type: 'home' }, session: { awardDetails: claimData.validClaimContactNull('home') } };
const homePhoneAddResponse = {
  type: 'home',
  addOrChange: 'add',
};
const homePhoneChangeRequest = { params: { type: 'home' }, session: { awardDetails: claimData.validClaim() } };
const homePhoneChangeResponse = {
  type: 'home',
  addOrChange: 'change',
};

const workPhoneAddRequest = { params: { type: 'work' }, session: { awardDetails: claimData.validClaimContactNull('work') } };
const workPhoneAddResponse = {
  type: 'work',
  addOrChange: 'add',
};
const workPhoneChangeRequest = { params: { type: 'work' }, session: { awardDetails: claimData.validClaim() } };
const workPhoneChangeResponse = {
  type: 'work',
  addOrChange: 'change',
};

const mobilePhoneAddRequest = { params: { type: 'mobile' }, session: { awardDetails: claimData.validClaimContactNull('mobile') } };
const mobilePhoneAddResponse = {
  type: 'mobile',
  addOrChange: 'add',
};
const mobilePhoneChangeRequest = { params: { type: 'mobile' }, session: { awardDetails: claimData.validClaim() } };
const mobilePhoneChangeResponse = {
  type: 'mobile',
  addOrChange: 'change',
};

const emailAddRequest = { params: { type: 'email' }, session: { awardDetails: claimData.validClaimContactNull('email') } };
const emailAddResponse = {
  type: 'email',
  addOrChange: 'add',
};
const emailChangeRequest = { params: { type: 'email' }, session: { awardDetails: claimData.validClaim() } };
const emailChangeResponse = {
  type: 'email',
  addOrChange: 'change',
};

const homePhoneRemoveRequest = { params: { type: 'home' }, session: { awardDetails: claimData.validClaim() } };
const homePhoneRemoveViewData = {
  type: 'home',
};

const emailRemoveRequest = { params: { type: 'email' }, session: { awardDetails: claimData.validClaim() } };
const emailRemoveViewData = {
  type: 'email',
};

const emptyHomePostRequest = { params: { type: 'home' }, session: { awardDetails: claimData.validClaim() }, body: { homePhoneNumber: '' } };
const validHomePostRequest = {
  ...kongData(), params: { type: 'home' }, session: { awardDetails: claimData.validClaim() }, body: { homePhoneNumber: '0000 000 0000' }, flash: flashMock,
};
const validAddHomePostRequest = { ...validHomePostRequest, session: { awardDetails: claimData.validClaimContactNull('home') } };

const emptyWorkPostRequest = { params: { type: 'work' }, session: { awardDetails: claimData.validClaim() }, body: { workPhoneNumber: '' } };
const validWorkPostRequest = {
  ...kongData(), params: { type: 'work' }, session: { awardDetails: claimData.validClaim() }, body: { workPhoneNumber: '0000 000 0000' }, flash: flashMock,
};
const validAddWorkPostRequest = { ...validWorkPostRequest, session: { awardDetails: claimData.validClaimContactNull('work') } };

const emptyMobilePostRequest = { params: { type: 'mobile' }, session: { awardDetails: claimData.validClaim() }, body: { mobilePhoneNumber: '' } };
const validMobilePostRequest = {
  ...kongData(), params: { type: 'mobile' }, session: { awardDetails: claimData.validClaim() }, body: { mobilePhoneNumber: '0000 000 0000' }, flash: flashMock,
};
const validAddMobilePostRequest = { ...validMobilePostRequest, session: { awardDetails: claimData.validClaimContactNull('mobile') } };

const emptyEmailPostRequest = { params: { type: 'email' }, session: { awardDetails: claimData.validClaim() }, body: { email: '' } };
const validEmailPostRequest = {
  ...kongData(), params: { type: 'email' }, session: { awardDetails: claimData.validClaim() }, body: { email: 'a@b.com' }, flash: flashMock,
};
const validAddEmailPostRequest = { ...validEmailPostRequest, session: { awardDetails: claimData.validClaimContactNull('email') } };

const emptyHomeRemovePostRequest = { params: { type: 'home' }, session: { awardDetails: claimData.validClaim() }, body: { removeContactNumber: '' } };
const validYesHomeRemovePostRequest = {
  ...kongData(), params: { type: 'home' }, session: { awardDetails: claimData.validClaim() }, body: { removeContactNumber: 'yes' }, flash: flashMock,
};
const validNoHomeRemovePostRequest = {
  ...kongData(), params: { type: 'home' }, session: { awardDetails: claimData.validClaim() }, body: { removeContactNumber: 'no' },
};

const emptyEmailRemovePostRequest = { params: { type: 'email' }, session: { awardDetails: claimData.validClaim() }, body: { removeContact: '' } };
const validYesEmailRemovePostRequest = {
  ...kongData(), params: { type: 'email' }, session: { awardDetails: claimData.validClaim() }, body: { removeContact: 'yes' }, flash: flashMock,
};
const validNoEmailRemovePostRequest = {
  ...kongData(), params: { type: 'email' }, session: { awardDetails: claimData.validClaim() }, body: { removeContact: 'no' },
};

const reqHeaders = requestKongHeaderData();

const contactDetailsUri = '/api/award';
const contactDetailsUpdateUri = '/api/award/updatecontactdetails';

const errorMessages = {
  400: 'Error - connection refused.',
  404: 'Error - award not found.',
  500: 'Error - could not save data.',
};

describe('Change circumstances contact controller', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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

    flash = { type: '', message: '' };

    testPromise = promiseWait();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getContactDetails function (GET /changes-enquiries/contact)', () => {
    it('should return view name and view data when called exists on API', () => {
      nock('http://test-url/').get(`${contactDetailsUri}/${contactDetailsRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      changeContactDetailsController.getContactDetails(contactDetailsRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/overview');
        assert.equal(JSON.stringify(genericResponse.data.details.contactDetailsSummaryRows), JSON.stringify(claimData.validContactDetailsViewData()));
      });
    });

    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${contactDetailsUri}/${contactDetailsRequest.session.searchedNino}`).reply(404, {});
      changeContactDetailsController.getContactDetails(contactDetailsRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });

  describe(' getChangeContactDetails function (GET /changes-and-enquiries/contact/home)', () => {
    it('should display home phone number add form when home is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(homePhoneAddRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(homePhoneAddResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });

    it('should display home phone number change form when home is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(homePhoneChangeRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(homePhoneChangeResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });
  });

  describe(' postChangeContactDetails function (POST /changes-and-enquiries/contact/home)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postChangeContactDetails(emptyHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postChangeContactDetails(validHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postChangeContactDetails(validHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postChangeContactDetails(validHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return a redirect when API returns 200 state - add', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validAddHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Home number added');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });

    it('should return a redirect when API returns 200 state - change', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validHomePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Home number changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe(' getChangeContactDetails function (GET /changes-and-enquiries/contact/work)', () => {
    it('should display work phone number add form when work is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(workPhoneAddRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(workPhoneAddResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });

    it('should display work phone number change form when work is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(workPhoneChangeRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(workPhoneChangeResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });
  });

  describe(' postChangeContactDetails function (POST /changes-and-enquiries/contact/work)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postChangeContactDetails(emptyWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postChangeContactDetails(validWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postChangeContactDetails(validWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postChangeContactDetails(validWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return a redirect when API returns 200 state - add', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validAddWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Work number added');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });

    it('should return a redirect when API returns 200 state - change', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validWorkPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Work number changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe(' getChangeContactDetails function (GET /changes-and-enquiries/contact/mobile)', () => {
    it('should display mobile phone number add form when mobile is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(mobilePhoneAddRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(mobilePhoneAddResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });

    it('should display mobile phone number change form when mobile is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(mobilePhoneChangeRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(mobilePhoneChangeResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      done();
    });
  });

  describe(' postChangeContactDetails function (POST /changes-and-enquiries/contact/mobile)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postChangeContactDetails(emptyMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postChangeContactDetails(validMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postChangeContactDetails(validMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postChangeContactDetails(validMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/index');
      });
    });

    it('should return a redirect when API returns 200 state - add', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validAddMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Mobile number added');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });

    it('should return a redirect when API returns 200 state - change', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validMobilePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Mobile number changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe(' getChangeContactDetails function (GET /changes-and-enquiries/contact/email)', () => {
    it('should display email add form when email is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(emailAddRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(emailAddResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      done();
    });

    it('should display email change form when email is within url', (done) => {
      changeContactDetailsController.getChangeContactDetails(emailChangeRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(emailChangeResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      done();
    });
  });

  describe(' postChangeContactDetails function (POST /changes-and-enquiries/contact/email)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postChangeContactDetails(emptyEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postChangeContactDetails(validEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postChangeContactDetails(validEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postChangeContactDetails(validEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/email');
      });
    });

    it('should return a redirect when API returns 200 state - add', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validAddEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Email address added');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });

    it('should return a redirect when API returns 200 state - change', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postChangeContactDetails(validEmailPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Email address changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe(' getRemoveContactDetails function (GET /changes-and-enquiries/remove/home)', () => {
    it('should display remove confirm form when home is within url', (done) => {
      changeContactDetailsController.getRemoveContactDetails(homePhoneRemoveRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(homePhoneRemoveViewData));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove');
      done();
    });
  });

  describe(' postRemoveContactDetails function (POST /changes-and-enquiries/remove/home)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postRemoveContactDetails(emptyHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postRemoveContactDetails(validYesHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postRemoveContactDetails(validYesHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postRemoveContactDetails(validYesHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove');
      });
    });

    it('should return a redirect to change when answer is no and API returns 200 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postRemoveContactDetails(validNoHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact/home');
      });
    });

    it('should return a redirect to contact when answer is yes and API returns 200 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postRemoveContactDetails(validYesHomeRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Home number removed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe(' getRemoveContactDetails function (GET /changes-and-enquiries/remove/email)', () => {
    it('should display remove confirm form when home is within url', (done) => {
      changeContactDetailsController.getRemoveContactDetails(emailRemoveRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(emailRemoveViewData));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove-email');
      done();
    });
  });

  describe(' postRemoveContactDetails function (POST /changes-and-enquiries/remove/email)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeContactDetailsController.postRemoveContactDetails(emptyEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove-email');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.BAD_REQUEST, {});
      changeContactDetailsController.postRemoveContactDetails(validYesEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove-email');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.NOT_FOUND, {});
      changeContactDetailsController.postRemoveContactDetails(validYesEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove-email');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeContactDetailsController.postRemoveContactDetails(validYesEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updatecontactdetails');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/contact/remove-email');
      });
    });

    it('should return a redirect to change when answer is no and API returns 200 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postRemoveContactDetails(validNoEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact/email');
      });
    });

    it('should return a redirect to contact when answer is yes and API returns 200 state', () => {
      nock('http://test-url/', reqHeaders).put(contactDetailsUpdateUri).reply(httpStatus.OK, {});
      changeContactDetailsController.postRemoveContactDetails(validYesEmailRemovePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Email address removed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });
});
