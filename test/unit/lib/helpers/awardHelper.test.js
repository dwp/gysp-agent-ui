const moment = require('moment');
const { assert } = require('chai');
const helper = require('../../../../lib/helpers/awardHelper');

const awardData = [{
  inPayment: false,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  fromDate: 1559023200000, // 28/05/2019
  toDate: 1590559200000, // 27/05/2020
}, {
  inPayment: true,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  fromDate: 1527487200000, // 28/05/2018
  toDate: 1558936800000, // 27/05/2019
}];

describe('awardHelper', () => {
  describe('getActiveAwardOnDate', () => {
    it('should return null when parameters are falsey', () => {
      assert.isNull(helper.getActiveAwardOnDate(undefined, null));
    });

    it('should return null when no awards were valid on that date', () => {
      const dte = moment('2018-05-27'); // just before first award from
      const awards = [...awardData];
      awards.find((award) => award.fromDate === 1559023200000).toDate = undefined;
      assert.isNull(helper.getActiveAwardOnDate(awards, dte));
    });

    it('should select award with undefined toDate', () => {
      const dte = moment('2020-05-28');
      const awards = [...awardData];
      awards.find((award) => award.fromDate === 1559023200000).toDate = undefined;
      const result = helper.getActiveAwardOnDate(awards, dte);
      assert.isTrue(result.fromDate === 1559023200000); // 28/05/2019
    });

    it('should select first award - date is same day as date from', () => {
      const dte = moment('2018-05-28');
      const awards = [...awardData];
      awards.find((award) => award.fromDate === 1559023200000).toDate = undefined;
      const result = helper.getActiveAwardOnDate(awards, dte);
      assert.isTrue(result.fromDate === 1527487200000); // 28/05/2019
    });

    it('should select first award - date is same day as date to', () => {
      const dte = moment('2019-05-27');
      const awards = [...awardData];
      awards.find((award) => award.fromDate === 1559023200000).toDate = undefined;
      const result = helper.getActiveAwardOnDate(awards, dte);
      assert.isTrue(result.fromDate === 1527487200000); // 28/05/2019
    });

    it('should select second award - date is same day as date from', () => {
      const dte = moment('2019-05-28');
      const awards = [...awardData];
      awards.find((award) => award.fromDate === 1559023200000).toDate = undefined;
      const result = helper.getActiveAwardOnDate(awards, dte);
      assert.isTrue(result.fromDate === 1559023200000); // 28/05/2019
    });
  });
});
