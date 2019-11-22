const i18n = require('i18next');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');

function head() {
  return [
    { text: i18n.t('award-list:table.head.from'), classes: 'govuk-!-width-one-quarter' },
    { text: i18n.t('award-list:table.head.to'), classes: 'govuk-!-width-one-quarter' },
    { text: i18n.t('award-list:table.head.weekly-amount') },
    { text: '' },
    { text: '' },
  ];
}

function rows(details) {
  return details.map((item, index) => {
    const array = [
      { text: dateHelper.longDate(item.fromDate) },
      { text: generalHelper.isNotUndefinedEmptyOrNull(item.toDate) ? dateHelper.longDate(item.toDate) : '' },
      { text: generalHelper.formatCurrency(item.totalAmount) },
      { html: `<a href="/changes-and-enquiries/award/${index}" class="govuk-link">Details</a>` },
    ];
    if (item.inPayment) {
      array.push({ html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In Payment</span>' });
    } else {
      array.push({ text: '' });
    }
    return array;
  });
}

module.exports = {
  formatter(details) {
    return {
      firstCellIsHeader: false,
      head: head(),
      rows: rows(details.awardAmounts),
    };
  },
};
