const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const helper = require('../../../../lib/helpers/timelineHelper');

const claimData = require('../../../lib/claimData');
const responseHelper = require('../../../lib/responseHelper');

let genericResponse = {};

const limit = 6;
const page = 0;

const validRequest = { session: { awardDetails: claimData.validClaim() } };

const auditApiUri = '/api/event';
const auditSearchApiUri = '/api/event/search';
const itemId = 'BLOG123456';
const subId = '1234';
const contactCategory = 'CONTACT';
const paymentCategory = 'PAYMENT';
const paymentDetailCategory = 'PAYMENTDETAIL';
const fakeCategory = 'FAKE';

const validResponse = [
  { eventName: 'contact-details:timeline.home_phone_number.removed', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'contact-details:timeline.work_phone_number.removed', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'contact-details:timeline.mobile_phone_number.changed', eventDate: '2019-07-22T13:26:37.172+0000' },
];

const validPaymentResponse = [
  { eventName: 'payment:timeline.banking_details.changed', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'payment:timeline.payment_frequency.changed', eventDate: '2019-07-22T13:26:37.172+0000' },
];

const validContactJson = {
  list: [
    { date: '22 July 2019', title: 'contact-details:timeline.home_phone_number.removed' },
    { date: '22 July 2019', title: 'contact-details:timeline.work_phone_number.removed' },
    { date: '22 July 2019', title: 'contact-details:timeline.mobile_phone_number.changed' },
  ],
  header: 'contact-details:timeline.header',
  empty: 'contact-details:timeline.empty',
};

const validPaymentDetailResponse = [
  { eventName: 'SENT', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'RETURNED', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'RECALLING', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'RECALLED', eventDate: '2019-07-22T13:26:37.172+0000' },
  { eventName: 'PAID', eventDate: '2019-07-22T13:26:37.172+0000' },
];

const validContactNoListJson = {
  list: null,
  header: 'contact-details:timeline.header',
  empty: 'contact-details:timeline.empty',
};

const validPaymentJson = {
  list: [
    { date: '22 July 2019', title: 'payment:timeline.banking_details.changed' },
    { date: '22 July 2019', title: 'payment:timeline.payment_frequency.changed' },
  ],
  header: 'payment:timeline.header',
  empty: 'payment:timeline.empty',
};

const validPaymentDetailJson = {
  list: [
    { date: '22 July 2019', title: 'Sent' },
    { date: '22 July 2019', title: 'Returned' },
    { date: '22 July 2019', title: 'Recalling' },
    { date: '22 July 2019', title: 'Recalled' },
    { date: '22 July 2019', title: 'Paid' },
  ],
  header: 'payment-status:timeline.header',
  empty: 'payment-status:timeline.empty',
};

const validPaymentNoListJson = {
  list: null,
  header: 'payment:timeline.header',
  empty: 'payment:timeline.empty',
};

const validPaymentDetailNoListJson = {
  list: null,
  header: 'payment-status:timeline.header',
  empty: 'payment-status:timeline.empty',
};

const timelineUnavailableJson = {
  list: null,
  header: 'payment-status:timeline.header',
  unavailable: 'timeline.unavailable',
};

const invalidJson = {
  list: null,
};

describe('timeline helper', () => {
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
  });
  describe('contact', () => {
    it('should return formatted timeline with list', async () => {
      nock('http://test-url/').get(auditApiUri).query({
        itemId, category: contactCategory, page, limit,
      }).reply(httpStatus.OK, validResponse);
      const response = await helper.getTimeline(validRequest, genericResponse, contactCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validContactJson));
    });

    it('should return formatted timeline with no list', async () => {
      nock('http://test-url/').get(auditApiUri).query({
        itemId, category: contactCategory, page, limit,
      }).reply(httpStatus.OK, {});
      const response = await helper.getTimeline(validRequest, genericResponse, contactCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validContactNoListJson));
    });

    it('should return formatted timeline with no list when response is 404', async () => {
      nock('http://test-url/').get(auditApiUri).query({
        itemId, category: contactCategory, page, limit,
      }).reply(httpStatus.NOT_FOUND);
      const response = await helper.getTimeline(validRequest, genericResponse, contactCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validContactNoListJson));
    });

    it('should return formatted timeline with no list when response is 400', async () => {
      nock('http://test-url/').get(auditApiUri).query({
        itemId, category: fakeCategory, page, limit,
      }).reply(httpStatus.BAD_REQUEST, {});
      const response = await helper.getTimeline(validRequest, genericResponse, fakeCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(invalidJson));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on cannot get FAKE timeline');
    });
  });
  describe('payment', () => {
    it('should return formatted timeline with list', async () => {
      nock('http://test-url/').get(auditApiUri).query({
        itemId, category: paymentCategory, page, limit,
      }).reply(httpStatus.OK, validPaymentResponse);
      const response = await helper.getTimeline(validRequest, genericResponse, paymentCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentJson));
    });

    it('should return formatted timeline with no list', async () => {
      nock('http://test-url/').get(`${auditApiUri}`).query({
        itemId, category: paymentCategory, page, limit,
      }).reply(httpStatus.OK, {});
      const response = await helper.getTimeline(validRequest, genericResponse, paymentCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentNoListJson));
    });

    it('should return formatted timeline with no list when response is 404', async () => {
      nock('http://test-url/').get(`${auditApiUri}`).query({
        itemId, category: paymentCategory, page, limit,
      }).reply(httpStatus.NOT_FOUND);
      const response = await helper.getTimeline(validRequest, genericResponse, paymentCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentNoListJson));
    });

    it('should return formatted timeline with no list when response is 400', async () => {
      nock('http://test-url/').get(`${auditApiUri}`).query({
        itemId, category: fakeCategory, page, limit,
      }).reply(httpStatus.BAD_REQUEST, {});
      const response = await helper.getTimeline(validRequest, genericResponse, fakeCategory);
      assert.equal(JSON.stringify(response), JSON.stringify(invalidJson));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on cannot get FAKE timeline');
    });
  });
  describe('payment details', () => {
    it('should return formatted timeline with list', async () => {
      nock('http://test-url/').get(auditSearchApiUri).query({
        subId, category: paymentDetailCategory, page, limit,
      }).reply(httpStatus.OK, validPaymentDetailResponse);
      const response = await helper.getTimeline(validRequest, genericResponse, paymentDetailCategory, subId);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentDetailJson));
    });

    it('should return formatted timeline with no list', async () => {
      nock('http://test-url/').get(auditSearchApiUri).query({
        subId, category: paymentDetailCategory, page, limit,
      }).reply(httpStatus.OK, {});
      const response = await helper.getTimeline(validRequest, genericResponse, paymentDetailCategory, subId);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentDetailNoListJson));
    });

    it('should return formatted timeline with no list when response is 404', async () => {
      nock('http://test-url/').get(auditSearchApiUri).query({
        subId, category: paymentDetailCategory, page, limit,
      }).reply(httpStatus.NOT_FOUND);
      const response = await helper.getTimeline(validRequest, genericResponse, paymentDetailCategory, subId);
      assert.equal(JSON.stringify(response), JSON.stringify(validPaymentDetailNoListJson));
    });

    it('should return formatted timeline with no list when response is 400', async () => {
      nock('http://test-url/').get(`${auditSearchApiUri}`).query({
        subId, category: paymentDetailCategory, page, limit,
      }).reply(httpStatus.BAD_REQUEST, {});
      const response = await helper.getTimeline(validRequest, genericResponse, paymentDetailCategory, subId);
      assert.equal(JSON.stringify(response), JSON.stringify(timelineUnavailableJson));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on cannot get PAYMENTDETAIL timeline');
    });
  });
});
