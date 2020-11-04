const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const claimData = require('../../../lib/claimData');

nock.disableNetConnect();

const controller = require('../../../../app/routes/tasks/entitlement/functions');

const responseHelper = require('../../../lib/responseHelper');
const errorHelper = require('../../../lib/errorHelper');

let genericResponse;

const awardByInviteKeyUri = '/api/award/award-by-invite-key';

// API Responses
const marriedWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'MARRIED' };
const civilWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'CIVILPARTNERSHIP' };
const widowedWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'WIDOWED' };

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const taskSession = { awardDetails: claimData.validClaimMarried() };
const ninoFormPost = { partnerNino: 'AA112233A' };
const dateVerificationFormPost = {
  dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
};

// Requests
const emptyPostRequest = { session: { ...taskSession }, body: {} };
const validNinoPostRequest = { session: { ...taskSession }, body: { ...ninoFormPost } };
const validDateOfBirthPostRequest = { session: { ...taskSession }, body: { ...dateVerificationFormPost } };
const updatedEntitlementDetails = {
  'date-of-birth': {
    dateDay: '1', dateMonth: '1', dateYear: '1952', verification: 'V',
  },
  'marital-date': {
    dateDay: '1', dateMonth: '1', dateYear: '2020', verification: 'V',
  },
};

// File paths
const tasksLayout = 'pages/tasks/layout.html';

let marriedTaskRequest;
let marriedTaskUpdatedRequest;
let civilTaskRequest;
let civilTaskUpdatedRequest;
let widowedTaskRequest;

const awardErrorsAssert = (statusCode, inviteKey) => {
  assert.equal(flash.type, 'error');
  assert.equal(flash.message, i18next.t(errorHelper.errorMessage(statusCode), { SERVICE: 'award' }));
  assert.equal(genericResponse.locals.logMessage, `${statusCode} - ${statusCode} - {} - Requested on /api/award/award-by-invite-key/${inviteKey}`);
};

describe('task entitlement controller ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    marriedTaskRequest = { session: { tasks: { 'work-item': marriedWorkItem } }, flash: flashMock };
    marriedTaskUpdatedRequest = { session: { tasks: { 'work-item': marriedWorkItem }, 'updated-entitlement-details': updatedEntitlementDetails, flash: flashMock } };
    civilTaskRequest = { session: { tasks: { 'work-item': civilWorkItem } }, flash: flashMock };
    civilTaskUpdatedRequest = { session: { tasks: { 'work-item': civilWorkItem }, 'updated-entitlement-details': updatedEntitlementDetails, flash: flashMock } };
    widowedTaskRequest = { session: { tasks: { 'work-item': widowedWorkItem }, flash: flashMock } };
  });

  describe('getPartnerNino function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getPartnerNino);
      assert.isFunction(controller.getPartnerNino);
    });

    it('should return task view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getPartnerNino(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.NOT_FOUND, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getPartnerNino(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.INTERNAL_SERVER_ERROR, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response OK - Married', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getPartnerNino(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/nino');
      assert.equal(genericResponse.data.maritalStatus, 'married');
    });

    it('should return task view when requested with API response OK - Civil Partnership', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getPartnerNino(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/nino');
      assert.equal(genericResponse.data.maritalStatus, 'civil');
    });
  });

  describe('postPartnerNino function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.postPartnerNino);
      assert.isFunction(controller.getPartnerNino);
    });

    it('should return view name with errors when called with empty post', () => {
      controller.postPartnerNino(emptyPostRequest, genericResponse);
      assert.lengthOf(Object.keys(genericResponse.data.errors), 1);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/nino');
    });

    it('should return redirect when called with valid post and save data in session', () => {
      controller.postPartnerNino(validNinoPostRequest, genericResponse);
      assert.deepEqual(validNinoPostRequest.session['updated-entitlement-details']['partner-nino'], ninoFormPost);
      assert.equal(genericResponse.address, '/tasks/task/detail');
    });
  });

  describe('getDateOfBirth function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getDateOfBirth);
      assert.isFunction(controller.getDateOfBirth);
    });

    it('should return task view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getDateOfBirth(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.NOT_FOUND, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getDateOfBirth(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.INTERNAL_SERVER_ERROR, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response OK - Married', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getDateOfBirth(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/date-of-birth');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.equal(genericResponse.data.details.dateDay, '19');
      assert.equal(genericResponse.data.details.dateMonth, '03');
      assert.equal(genericResponse.data.details.dateYear, '1952');
    });

    it('should return task view when requested with API response OK - Married with no DOB', async () => {
      const marriedPartnerNoDateOfBirth = { ...claimData.validClaimMarried() };
      marriedPartnerNoDateOfBirth.partnerDetail.dob = null;
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, marriedPartnerNoDateOfBirth);
      await controller.getDateOfBirth(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/date-of-birth');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.isNull(genericResponse.data.details, null);
    });

    it('should return task view when requested with API response OK - Civil Partnership', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getDateOfBirth(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/date-of-birth');
      assert.equal(genericResponse.data.maritalStatus, 'civil');
    });
  });

  describe('postDateOfBirth function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.postDateOfBirth);
      assert.isFunction(controller.postDateOfBirth);
    });

    it('should return view name with errors when called with empty post', () => {
      controller.postDateOfBirth(emptyPostRequest, genericResponse);
      assert.lengthOf(Object.keys(genericResponse.data.errors), 5);
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {});
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/date-of-birth');
    });

    it('should return redirect when called with valid post and save data in session', () => {
      controller.postDateOfBirth(validDateOfBirthPostRequest, genericResponse);
      assert.deepEqual(validDateOfBirthPostRequest.session['updated-entitlement-details']['date-of-birth'], dateVerificationFormPost);
      assert.equal(genericResponse.address, '/tasks/task/detail');
    });
  });

  describe('getMaritalDate function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getMaritalDate);
      assert.isFunction(controller.getMaritalDate);
    });

    it('should return task view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getMaritalDate(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.NOT_FOUND, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getMaritalDate(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      awardErrorsAssert(httpStatus.INTERNAL_SERVER_ERROR, marriedWorkItem.inviteKey);
    });

    it('should return task view when requested with API response OK - Married', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getMaritalDate(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/marital-date');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.equal(genericResponse.data.details.dateDay, '19');
      assert.equal(genericResponse.data.details.dateMonth, '03');
      assert.equal(genericResponse.data.details.dateYear, '2000');
    });

    it('should return task view when requested with API response OK - Updated Marriage date', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getMaritalDate(marriedTaskUpdatedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/marital-date');
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.equal(genericResponse.data.details.dateDay, '1');
      assert.equal(genericResponse.data.details.dateMonth, '1');
      assert.equal(genericResponse.data.details.dateYear, '2020');
    });

    it('should return task view when requested with API response OK - Civil Partnership', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getMaritalDate(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/marital-date');
      assert.equal(genericResponse.data.maritalStatus, 'civil');
      assert.equal(genericResponse.data.details.dateDay, '19');
      assert.equal(genericResponse.data.details.dateMonth, '03');
      assert.equal(genericResponse.data.details.dateYear, '2000');
    });

    it('should return task view when requested with API response OK - Update civil partnership date', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getMaritalDate(civilTaskUpdatedRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/marital-date');
      assert.equal(genericResponse.data.maritalStatus, 'civil');
      assert.equal(genericResponse.data.details.dateDay, '1');
      assert.equal(genericResponse.data.details.dateMonth, '1');
      assert.equal(genericResponse.data.details.dateYear, '2020');
    });
  });

  describe('postMaritalDate function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.postMaritalDate);
      assert.isFunction(controller.postMaritalDate);
    });

    it('should return view name with errors when called with empty post', () => {
      controller.postMaritalDate(emptyPostRequest, genericResponse);
      assert.lengthOf(Object.keys(genericResponse.data.errors), 5);
      assert.equal(genericResponse.data.maritalStatus, 'married');
      assert.deepEqual(genericResponse.data.details, {});
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/marital-date');
    });

    it('should return redirect when called with valid post and save data in session', () => {
      controller.postMaritalDate(validDateOfBirthPostRequest, genericResponse);
      assert.deepEqual(validDateOfBirthPostRequest.session['updated-entitlement-details']['marital-date'], dateVerificationFormPost);
      assert.equal(genericResponse.address, '/tasks/task/detail');
    });
  });

  describe('getEntitledToInheritedStatePension function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getEntitledToInheritedStatePension);
      assert.isFunction(controller.getEntitledToInheritedStatePension);
    });

    it('should setup common component', () => {
      controller.getEntitledToInheritedStatePension(widowedTaskRequest, genericResponse);
      assert.equal(genericResponse.data.template, tasksLayout);
      assert.equal(genericResponse.data.backHref, '/task/detail');
    });
  });
});
