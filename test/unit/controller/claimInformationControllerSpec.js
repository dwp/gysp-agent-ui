const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

chai.use(chaiAsPromised);

nock.disableNetConnect();

const claimInformationController = require('../../../app/routes/claim-information/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const emptyPost = { body: {}, headers: { cookie: 'test=test;staff_id=test@test.com;' } };
const claimInformationEmptyPost = {
  body: {
    type: '', fromDateDay: '', fromDateMonth: '', fromDateYear: '', toDateDay: '', toDateMonth: '', toDateYear: '',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const claimInformationValidPost = {
  body: {
    type: 'letters', fromDateDay: '1', fromDateMonth: '1', fromDateYear: '2018', toDateDay: '10', toDateMonth: '1', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const claimInformationInvalidDates = {
  body: {
    type: 'letters', fromDateDay: '40', fromDateMonth: '1', fromDateYear: '2017', toDateDay: '35', toDateMonth: '3', toDateYear: '2017',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const claimInformationInvalidDatesToDateBeforeFrom = {
  body: {
    type: 'letters', fromDateDay: '2', fromDateMonth: '1', fromDateYear: '2017', toDateDay: '1', toDateMonth: '1', toDateYear: '2017',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};

const validCitizenPostPeriod = {
  body: {
    type: 'citizeninformation', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '28', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const invalidCitizenPostPeriod = {
  body: {
    type: 'citizeninformation', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '29', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const validCitizenPostPeriodHeaders = [{ type: 'Content-Disposition', value: 'attachment; filename=citizeninformation-2018-5-1-2018-5-28.csv' }, { type: 'Content-Length', value: 16 }];

const validClaimPostPeriod = {
  body: {
    type: 'claiminformation', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '28', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const invalidClaimPostPeriod = {
  body: {
    type: 'claiminformation', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '29', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};

const validClaimPostPeriodHeaders = [{ type: 'Content-Disposition', value: 'attachment; filename=claiminformation-2018-5-1-2018-5-28.csv' }, { type: 'Content-Length', value: 16 }];

const validFilterReasonPostPeriod = {
  body: {
    type: 'filterreason', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '28', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};
const invalidFilterReasonPostPeriod = {
  body: {
    type: 'claiminformation', fromDateDay: '1', fromDateMonth: '5', fromDateYear: '2018', toDateDay: '29', toDateMonth: '5', toDateYear: '2018',
  },
  headers: { cookie: 'test=test;staff_id=test@test.com;' },
};

const validFilterReasonPostPeriodHeaders = [{ type: 'Content-Disposition', value: 'attachment; filename=filterreason-2018-5-1-2018-5-28.csv' }, { type: 'Content-Length', value: 16 }];


const validResponse = 'this,is,CSV,Data';
const validHeaders = [{ type: 'Content-Disposition', value: 'attachment; filename=letters-2018-1-1-2018-1-10.csv' }, { type: 'Content-Length', value: 16 }];
const error500Response = 'Error - could not get claim data';
const error404Response = 'Error - could not get claim data';
const errorOtherErrorResponse = 'Error - could not get claim data';
const errorNoStatus = 'Can\'t connect to backend';
const validationErrorMessage = 'Error - Please correct the issues below.';

const letterMIInfo = '/api/mi/letters/report';

const validLetterMIInfoQuery = {
  fromDate: `${claimInformationValidPost.body.fromDateYear}-${claimInformationValidPost.body.fromDateMonth}-${claimInformationValidPost.body.fromDateDay}`,
  toDate: `${claimInformationValidPost.body.toDateYear}-${claimInformationValidPost.body.toDateMonth}-${claimInformationValidPost.body.toDateDay}`,
};

const citizenInfo = '/api/mi/citizeninformation/report';

const validCitizenInfoQuery = {
  fromDate: `${validCitizenPostPeriod.body.fromDateYear}-${validCitizenPostPeriod.body.fromDateMonth}-${validCitizenPostPeriod.body.fromDateDay}`,
  toDate: `${validCitizenPostPeriod.body.toDateYear}-${validCitizenPostPeriod.body.toDateMonth}-${validCitizenPostPeriod.body.toDateDay}`,
};

const claimInfo = '/api/mi/claiminformation/report';

const validClaimInfoQuery = {
  fromDate: `${validClaimPostPeriod.body.fromDateYear}-${validClaimPostPeriod.body.fromDateMonth}-${validClaimPostPeriod.body.fromDateDay}`,
  toDate: `${validClaimPostPeriod.body.toDateYear}-${validClaimPostPeriod.body.toDateMonth}-${validClaimPostPeriod.body.toDateDay}`,
};

const filterReasonInfo = '/api/mi/filterreason/report';

const validFilterReasonQuery = {
  fromDate: `${validFilterReasonPostPeriod.body.fromDateYear}-${validFilterReasonPostPeriod.body.fromDateMonth}-${validFilterReasonPostPeriod.body.fromDateDay}`,
  toDate: `${validFilterReasonPostPeriod.body.toDateYear}-${validFilterReasonPostPeriod.body.toDateMonth}-${validFilterReasonPostPeriod.body.toDateDay}`,
};

describe('Claim information controller ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.csvResponse();
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
      }, 20);
    });
  });

  describe(' getClaimInformation function ', () => {
    it('should return claim information view when requested by the user', () => {
      claimInformationController.getClaimInformation(emptyPost, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
    });
  });

  describe(' postClaimInformation function ', () => {
    it('should return view with global error and inline errors when with empty post', () => {
      claimInformationController.postClaimInformation(emptyPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.data.errors.fromDate.text, 'From date is required');
        assert.equal(genericResponse.data.errors.toDate.text, 'To date is required');
        assert.equal(genericResponse.data.errors.type.text, 'Please complete.');
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return CSV response when 200 status is received', () => {
      nock('http://test-url').get(letterMIInfo).query(validLetterMIInfoQuery).reply(httpStatus.OK, validResponse);
      claimInformationController.postClaimInformation(claimInformationValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.responseType, 'text/csv');
        assert.equal(JSON.stringify(genericResponse.header), JSON.stringify(validHeaders));
        assert.equal(genericResponse.body, validResponse);
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url').get(letterMIInfo).query(validLetterMIInfoQuery).reply(httpStatus.INTERNAL_SERVER_ERROR);
      claimInformationController.postClaimInformation(claimInformationValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, error500Response);
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url').get(letterMIInfo).query(validLetterMIInfoQuery).reply(httpStatus.NOT_FOUND);
      claimInformationController.postClaimInformation(claimInformationValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, error404Response);
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with error when API returns at status code that is not 200, 404 or 500', () => {
      nock('http://test-url').get(letterMIInfo).query(validLetterMIInfoQuery).reply(httpStatus.BAD_GATEWAY);
      claimInformationController.postClaimInformation(claimInformationValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorOtherErrorResponse);
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url').get(letterMIInfo).query(validLetterMIInfoQuery);
      claimInformationController.postClaimInformation(claimInformationValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorNoStatus);
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with global error and inline errors when no values posted', () => {
      claimInformationController.postClaimInformation(claimInformationEmptyPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.data.errors.fromDate.text, 'From date is required');
        assert.equal(genericResponse.data.errors.toDate.text, 'To date is required');
        assert.equal(genericResponse.data.errors.type.text, 'Please complete.');
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with errors when from and to dates are invalid format', () => {
      claimInformationController.postClaimInformation(claimInformationInvalidDates, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.data.errors.fromDate.text, 'From date must be a valid date');
        assert.equal(genericResponse.data.errors.toDate.text, 'To date must be a valid date');
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with errors when from date is after to date', () => {
      claimInformationController.postClaimInformation(claimInformationInvalidDatesToDateBeforeFrom, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.data.errors.fromDate.text, 'From date is after To date');
        assert.equal(genericResponse.data.errors.toDate.text, 'To date is before From date');
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    it('should return view with errors when to date is before from date', () => {
      claimInformationController.postClaimInformation(claimInformationInvalidDatesToDateBeforeFrom, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.data.errors.fromDate.text, 'From date is after To date');
        assert.equal(genericResponse.data.errors.toDate.text, 'To date is before From date');
        assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
      });
    });

    describe('citizen information', () => {
      it('should return view with errors when date is is more then 28 days', () => {
        claimInformationController.postClaimInformation(invalidCitizenPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.data.globalError, validationErrorMessage);
          assert.equal(genericResponse.data.errors.maximumPeriod, 'Maximum search period is 28 days');
          assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
        });
      });

      it('should return view CSV response when date period is 28 days', () => {
        nock('http://test-url').get(citizenInfo).query(validCitizenInfoQuery).reply(httpStatus.OK, validResponse);
        claimInformationController.postClaimInformation(validCitizenPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.responseType, 'text/csv');
          assert.equal(JSON.stringify(genericResponse.header), JSON.stringify(validCitizenPostPeriodHeaders));
          assert.equal(genericResponse.body, validResponse);
        });
      });
    });

    describe('claim information', () => {
      it('should return view with errors when date period is more then 28 days', () => {
        claimInformationController.postClaimInformation(invalidClaimPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.data.globalError, validationErrorMessage);
          assert.equal(genericResponse.data.errors.maximumPeriod, 'Maximum search period is 28 days');
          assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
        });
      });

      it('should return view CSV response when date period is 28 days', () => {
        nock('http://test-url').get(claimInfo).query(validClaimInfoQuery).reply(httpStatus.OK, validResponse);
        claimInformationController.postClaimInformation(validClaimPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.responseType, 'text/csv');
          assert.equal(JSON.stringify(genericResponse.header), JSON.stringify(validClaimPostPeriodHeaders));
          assert.equal(genericResponse.body, validResponse);
        });
      });
    });

    describe('filter reason', () => {
      it('should return view with errors when date period is more then 28 days', () => {
        claimInformationController.postClaimInformation(invalidFilterReasonPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.data.globalError, validationErrorMessage);
          assert.equal(genericResponse.data.errors.maximumPeriod, 'Maximum search period is 28 days');
          assert.equal(genericResponse.viewName, 'pages/claim-information/claim');
        });
      });

      it('should return view CSV response when date period is 28 days', () => {
        nock('http://test-url').get(filterReasonInfo).query(validFilterReasonQuery).reply(httpStatus.OK, validResponse);
        claimInformationController.postClaimInformation(validFilterReasonPostPeriod, genericResponse);
        return testPromise.then(() => {
          assert.equal(genericResponse.responseType, 'text/csv');
          assert.equal(JSON.stringify(genericResponse.header), JSON.stringify(validFilterReasonPostPeriodHeaders));
          assert.equal(genericResponse.body, validResponse);
        });
      });
    });
  });
});
