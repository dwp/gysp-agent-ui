const i18n = require('i18next');
const generalHelper = require('../../lib/helpers/general');
const dateHelper = require('../../lib/dateHelper');

const maxDaysAllowedToChangePaidStaus = 14;

module.exports = {
  formatter(detail, id, awardStatus) {
    if (detail === undefined || detail === null) {
      return false;
    }

    const object = {
      id,
      status: generalHelper.formatPaymentStatus(detail.status),
      accountHolder: detail.accountName,
      accountNumber: detail.accountNumber,
      sortCode: generalHelper.formatSortCode(detail.sortCode),
    };

    if (detail.referenceNumber) {
      object.rollNumber = detail.referenceNumber;
    }
    object.detailsSummaryRows = [
      {
        key: { text: i18n.t('payment-detail:summary-keys.total'), classes: 'govuk-!-width-one-third' },
        value: { text: `£${generalHelper.floatDecimal(detail.totalAmount)}`, classes: 'govuk-!-font-weight-bold' },
      },
      {
        key: { text: i18n.t('payment-detail:summary-keys.period'), classes: 'govuk-!-width-one-third govuk-!-font-weight-regular' },
        value: { html: `${dateHelper.slashDate(detail.startDate)} to<br />${dateHelper.slashDate(detail.endDate)}`, classes: 'payment-detail__period' },
      },
      {
        key: { text: i18n.t('payment-detail:summary-keys.status'), classes: 'govuk-!-width-one-third govuk-!-font-weight-regular' },
        value: { text: generalHelper.formatPaymentStatus(detail.status) },
      },
    ];
    if (detail.status === 'PAID' && dateHelper.daysBetweenNowDate(detail.creditDate) <= maxDaysAllowedToChangePaidStaus) {
      object.detailsSummaryRows[2].actions = {
        items: [{
          href: `/changes-and-enquiries/payment-history/${id}/status-update`,
          text: i18n.t('payment-detail:summary-keys.statusLink.returned.text'),
        }],
      };
    }

    if (detail.status === 'SENT') {
      object.detailsSummaryRows[2].actions = {
        items: [{
          href: `/changes-and-enquiries/payment-history/${id}/status-update`,
          text: i18n.t('payment-detail:summary-keys.statusLink.recall.text'),
        }],
      };
    }

    if (detail.status === 'RECALLING') {
      object.detailsSummaryRows[2].actions = {
        items: [{
          href: `/changes-and-enquiries/payment-history/${id}/status-update`,
          text: i18n.t('payment-detail:summary-keys.statusLink.recalling.text'),
        }],
      };
    }

    if ((detail.status === 'RETURNED' || detail.status === 'RECALLED') && (awardStatus !== 'DEAD' && awardStatus !== 'DEADNOTVERIFIED')) {
      object.detailsSummaryRows[2].actions = {
        items: [{
          href: `/changes-and-enquiries/payment-history/${id}/reissue`,
          text: i18n.t('payment-detail:summary-keys.statusLink.reissue.text'),
        }],
      };
    }

    return object;
  },
};
