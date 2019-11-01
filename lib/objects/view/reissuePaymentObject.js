const i18n = require('i18next');
const generalHelper = require('../../helpers/general');
const dateHelper = require('../../../lib/dateHelper');

module.exports = {
  formatter(paymentDetail, awardDetail) {
    const object = {
      paymentDetailsSummaryRows: [{
        key: { text: i18n.t('reissue-payment:payment-details.total'), classes: 'govuk-!-width-one-third govuk-!-font-weight-bold' },
        value: { text: `£${generalHelper.floatDecimal(paymentDetail.totalAmount)}`, classes: 'govuk-!-font-weight-bold' },
      }, {
        key: { text: i18n.t('reissue-payment:payment-details.period'), classes: 'govuk-!-width-one-third govuk-!-font-weight-regular' },
        value: { text: `${dateHelper.slashDate(paymentDetail.startDate)} to ${dateHelper.slashDate(paymentDetail.endDate)}` },
      }],
      accountDetailsSummaryRows: [{
        key: { text: i18n.t('reissue-payment:account-details.account-holder'), classes: 'govuk-!-width-one-third' },
        value: { text: awardDetail.accountDetail.accountHolder },
      }, {
        key: { text: i18n.t('reissue-payment:account-details.account-number'), classes: 'govuk-!-width-one-third' },
        value: { text: awardDetail.accountDetail.accountNumber },
      }, {
        key: { text: i18n.t('reissue-payment:account-details.sort-code'), classes: 'govuk-!-width-one-third' },
        value: { text: generalHelper.formatSortCode(awardDetail.accountDetail.sortCode) },
      }],
    };

    if (awardDetail.accountDetail.referenceNumber) {
      object.accountDetailsSummaryRows[3] = {
        key: { text: i18n.t('reissue-payment:account-details.roll-number'), classes: 'govuk-!-width-one-third' },
        value: { text: awardDetail.accountDetail.referenceNumber },
      };
    }

    return object;
  },
};
